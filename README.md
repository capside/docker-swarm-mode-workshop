# Docker y Swarm mode

## Despliegue del cluster en Azure

* [Lanzar el cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acsengine-swarmmode)

![Cluster](https://raw.githubusercontent.com/Azure/acs-engine/master/docs/images/swarm.png)

* Conectar al master creando un túnel al puerto 8080
```
username=<username>
masterfqdn=<masterfqdn>
agentsfqdn=<agentsfqdn>
ssh -L 8080:localhost:8080 $username@$masterfqdn

```
* Activa el modo experimental añadiendo ```{"experimental":true}``` al fichero ```/etc/docker/daemon.json``` del master y reiniciando
```
$>sudo vim /etc/docker/daemon.json
$>sudo systemctl stop docker
$>sudo systemctl start docker
```
* Alternativamente puedes crear [un cluster local](https://pastebin.com/KizLE6Cf) usando *Docker in Docker*.

## Visualización del estado del clúster

* Lanzar visualizador de swarm dentro del nodo master (no es un servicio)
```
$> docker run -d -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock --name visualizer dockersamples/visualizer
```
* Acceder al visualizar [localhost:8080](http://localhost:8080)

## Despliegue manual de la aplicación

* Desplegar manualmente la aplicación
```
docker network create --driver overlay gallifrey
docker service create --name riversong --publish 8888:8888 --network gallifrey ciberado/riversong
docker service create --name thedoctor --publish 80:80 --env INTERNAL_SERVICE_NAME=riversong  --network gallifrey ciberado/thedoctor
```
* Invoca la aplicación *edge* con ```curl http://$agentsfqdn:80```
* Repliega con
```
docker service rm thedoctor
docker service rm riversong
docker network rm gallifrey
```

## Despliegue de la aplicación con Docker Compose 

* Crea el stack con
```
wget -O docker-compose.yml https://pastebin.com/raw/1E02pXzT
docker stack deploy --with-registry-auth --compose-file docker-compose.yml test
```
* Invoca la aplicación *edge* con ```curl http://$agentsfqdn:80```
* docker service scale test_riversong=2
* Invocando de nuevo el servicio *edge* deberías ver cómo cambia la IP del servicio interno.
 



