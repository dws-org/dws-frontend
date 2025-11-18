# Deployment Guide - Namespace "test"

This guide shows you how to deploy the Helm chart to the `test` namespace.

## Prerequisites

1. **Docker** installed and running
2. **Kubernetes cluster** access configured (kubectl)
3. **Helm** installed (version 3.x)
4. **Docker registry** access (or use a local registry)

## Step 1: Build and Push Docker Image

First, you need to build your Docker image and push it to a registry.

### Option A: Using Docker Hub

```bash
# Navigate to the code directory
cd /Users/oskarfranzen/WebstormProjects/dws-frontend/code

# Build the image
docker build -t your-dockerhub-username/dws-frontend:latest .

# Push to Docker Hub
docker push your-dockerhub-username/dws-frontend:latest
```

### Option B: Using a Private Registry (e.g., GCR, ECR, ACR)

```bash
# Example for Google Container Registry (GCR)
docker build -t gcr.io/your-project/dws-frontend:latest .
docker push gcr.io/your-project/dws-frontend:latest

# Example for AWS ECR
docker build -t your-account.dkr.ecr.region.amazonaws.com/dws-frontend:latest .
docker push your-account.dkr.ecr.region.amazonaws.com/dws-frontend:latest
```

### Option C: Using Local Registry (for testing)

```bash
# Start local registry
docker run -d -p 5000:5000 --name registry registry:2

# Build and tag for local registry
docker build -t localhost:5000/dws-frontend:latest .
docker push localhost:5000/dws-frontend:latest
```

## Step 2: Update values.yaml

Update the `values.yaml` file with your image repository:

```yaml
image:
  repository: your-dockerhub-username/dws-frontend  # Or your registry path
  pullPolicy: IfNotPresent
  tag: "latest"  # Or specific version tag
```

## Step 3: Create Namespace (if it doesn't exist)

```bash
kubectl create namespace test
```

## Step 4: Deploy with Helm

### Basic Deployment

```bash
# Navigate to the Helm chart directory
cd /Users/oskarfranzen/WebstormProjects/dws-frontend/code/dws-frontend

# Install/upgrade the Helm chart
helm upgrade --install dws-frontend . \
  --namespace test \
  --create-namespace
```

### Deployment with Custom Values

If you want to override specific values:

```bash
helm upgrade --install dws-frontend . \
  --namespace test \
  --create-namespace \
  --set image.repository=your-dockerhub-username/dws-frontend \
  --set image.tag=latest \
  --set replicaCount=2 \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=test.example.com
```

### Deployment with Custom values.yaml File

Create a `values-test.yaml` file for test environment:

```yaml
# values-test.yaml
replicaCount: 1

image:
  repository: your-dockerhub-username/dws-frontend
  tag: "latest"

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: test.example.com
      paths:
        - path: /
          pathType: Prefix
```

Then deploy:

```bash
helm upgrade --install dws-frontend . \
  --namespace test \
  --create-namespace \
  -f values.yaml \
  -f values-test.yaml
```

## Step 5: Verify Deployment

```bash
# Check if pods are running
kubectl get pods -n test

# Check deployment status
kubectl get deployment -n test

# Check service
kubectl get service -n test

# Check ingress (if enabled)
kubectl get ingress -n test

# View logs
kubectl logs -n test -l app.kubernetes.io/name=dws-frontend --tail=50

# Describe pod for troubleshooting
kubectl describe pod -n test -l app.kubernetes.io/name=dws-frontend
```

## Step 6: Access the Application

### If using ClusterIP (default)

```bash
# Port forward to access locally
kubectl port-forward -n test service/dws-frontend 8080:80

# Then access at http://localhost:8080
```

### If using Ingress

Access via the configured hostname (e.g., `http://test.example.com`)

### If using LoadBalancer

```bash
# Change service type in values.yaml
service:
  type: LoadBalancer

# Then get the external IP
kubectl get service -n test
```

## Common Commands

### Upgrade Deployment

```bash
helm upgrade dws-frontend . --namespace test
```

### Rollback

```bash
# List releases
helm list -n test

# Rollback to previous version
helm rollback dws-frontend -n test

# Rollback to specific revision
helm rollback dws-frontend 2 -n test
```

### Uninstall

```bash
helm uninstall dws-frontend -n test
```

### View Values

```bash
# View current values
helm get values dws-frontend -n test

# View all values (including defaults)
helm get values dws-frontend -n test --all
```

## Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pod -n test -l app.kubernetes.io/name=dws-frontend

# Check logs
kubectl logs -n test -l app.kubernetes.io/name=dws-frontend
```

### Image pull errors

```bash
# Verify image exists
docker pull your-dockerhub-username/dws-frontend:latest

# Check imagePullSecrets if using private registry
kubectl get secrets -n test
```

### Health check failures

```bash
# Check if the app is responding
kubectl exec -n test -it deployment/dws-frontend -- wget -qO- http://localhost:3000/
```

## Quick Deploy Script

Save this as `deploy-test.sh`:

```bash
#!/bin/bash

set -e

IMAGE_REPO="${IMAGE_REPO:-your-dockerhub-username/dws-frontend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="test"

echo "Building Docker image..."
cd /Users/oskarfranzen/WebstormProjects/dws-frontend/code
docker build -t ${IMAGE_REPO}:${IMAGE_TAG} .

echo "Pushing Docker image..."
docker push ${IMAGE_REPO}:${IMAGE_TAG}

echo "Creating namespace if not exists..."
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

echo "Deploying with Helm..."
cd dws-frontend
helm upgrade --install dws-frontend . \
  --namespace ${NAMESPACE} \
  --create-namespace \
  --set image.repository=${IMAGE_REPO} \
  --set image.tag=${IMAGE_TAG} \
  --wait

echo "Deployment complete!"
echo "Check status with: kubectl get pods -n ${NAMESPACE}"
```

Make it executable and run:

```bash
chmod +x deploy-test.sh
./deploy-test.sh
```

