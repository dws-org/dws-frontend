# Helm Chart Konfiguration - Anleitung

Diese Anleitung erklärt, wie du die `values.yaml` für deine Next.js Frontend-Anwendung konfigurierst.

## 🚀 Wichtige Felder, die du ausfüllen musst:

### 1. **Image Repository und Tag** (Zeilen 9-14)
```yaml
image:
  repository: dein-registry/dws-frontend  # z.B. docker.io/username/dws-frontend oder gcr.io/project/dws-frontend
  pullPolicy: IfNotPresent
  tag: "v1.0.0"  # Oder lass es leer, dann wird appVersion verwendet
```

**Wichtig**: 
- `repository`: Die URL zu deinem Docker-Image (nach dem Build und Push)
- `tag`: Die Version deines Images (z.B. Git-Tag, Commit-Hash, oder Versionsnummer)

### 2. **Replica Count** (Zeile 6)
```yaml
replicaCount: 2  # Anzahl der Pod-Instanzen (für Production meist 2-3)
```
- Für Development: 1
- Für Production: 2-3 (für Redundanz)

### 3. **Service Port** (Zeilen 53-59)
```yaml
service:
  type: ClusterIP  # Für Production: ClusterIP (intern) oder LoadBalancer (extern)
  port: 80  # Externe Service-Port-Nummer
  containerPort: 3000  # Port auf dem Next.js im Container läuft (siehe Dockerfile)
```

**Wichtig**: 
- Next.js läuft im Container auf Port 3000 (siehe Dockerfile)
- Der Service mappt externen Port 80 auf Container-Port 3000
- `containerPort: 3000` ist bereits konfiguriert und muss nicht geändert werden, es sei denn, dein Container läuft auf einem anderen Port

### 4. **Ingress** (Zeilen 60-74) - Für externen Zugriff
```yaml
ingress:
  enabled: true  # Auf true setzen, wenn du externen Zugriff brauchst
  className: "nginx"  # Dein Ingress-Controller (nginx, traefik, etc.)
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"  # Für TLS
  hosts:
    - host: deine-app.example.com  # Deine Domain
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: dws-frontend-tls
      hosts:
        - deine-app.example.com
```

### 5. **Resources** (Zeilen 114-124) - CPU und Memory Limits
```yaml
resources:
  limits:
    cpu: 500m      # 0.5 CPU
    memory: 512Mi  # 512 MB RAM
  requests:
    cpu: 100m      # Mindestens 0.1 CPU
    memory: 128Mi  # Mindestens 128 MB RAM
```

**Empfehlung für Next.js**:
- Requests: CPU 100m, Memory 256Mi
- Limits: CPU 1000m, Memory 1Gi

### 6. **Health Checks** (Zeilen 127-134)
```yaml
livenessProbe:
  httpGet:
    path: /api/health  # Oder / für Next.js
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health  # Oder / für Next.js
    port: http
  initialDelaySeconds: 10
  periodSeconds: 5
```

### 7. **Autoscaling** (Zeilen 137-142) - Optional
```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## 🔧 Beispiel-Konfiguration für Production:

```yaml
replicaCount: 2

image:
  repository: your-registry.io/dws-frontend
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80
  containerPort: 3000

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: app.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: dws-frontend-tls
      hosts:
        - app.example.com

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 256Mi

livenessProbe:
  httpGet:
    path: /
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /
    port: http
  initialDelaySeconds: 10
  periodSeconds: 5

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70
```

## ⚠️ Wichtige Hinweise:

1. **Port-Konfiguration**: 
   - Das Dockerfile verwendet Port 3000 für Next.js
   - Der Service-Port ist auf 80 konfiguriert (extern)
   - Der Container-Port ist auf 3000 konfiguriert (intern)
   - Diese Konfiguration ist korrekt und muss nicht geändert werden

2. **Image Pull Secrets**: Wenn dein Image in einer privaten Registry liegt, musst du `imagePullSecrets` konfigurieren:
   ```yaml
   imagePullSecrets:
     - name: registry-secret
   ```

3. **Environment Variables**: Falls du Umgebungsvariablen brauchst (z.B. für API-URLs), musst du diese in der Deployment-Template hinzufügen.

4. **Next.js Standalone**: Das Dockerfile verwendet Next.js Standalone-Mode, was gut für Kubernetes ist.

## ✅ Port-Konfiguration ist korrekt!

Die Port-Konfiguration ist jetzt korrekt:
- **Container-Port**: 3000 (Next.js läuft darauf)
- **Service-Port**: 80 (externer Zugriff)
- Der Service mappt automatisch Port 80 → Port 3000 über `targetPort: http`

Du musst nichts ändern, es sei denn, dein Next.js läuft auf einem anderen Port.

