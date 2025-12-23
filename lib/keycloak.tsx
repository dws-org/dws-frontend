import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak.ltu-m7011e-6.se/',  // Your Keycloak URL
  realm: 'dws-org',                                    // The realm you created
  clientId: 'dws-frontend'                        // The client you created
});

export default keycloak;