# Continuous Delivery con Team Services

## Instrucciones oficiales

https://docs.microsoft.com/en-us/azure/container-service/container-service-docker-swarm-mode-setup-ci-cd-acs-engine

## Swarm Mode con ACS Engine

https://github.com/Azure/azure-quickstart-templates/tree/master/101-acsengine-swarmmode

## Proyectos a desplegar

http://github.com/capside/docker-swarm-mode-workshop/

## Visual Studio Team Services:

http://visualstudio.com/team-services/

## Comandos de despliegue

```
docker login -u $(docker.username) -p $(docker.password) $(docker.registry) &&  export DOCKER_HOST=:2375 &&  docker stack deploy --with-registry-auth --compose-file ~/docker-compose.yml staging
```

