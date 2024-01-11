# Boomerang Flow Web Client

The web client for Boomerang Flow, a low-code, cloud-native workflow automation tool.

Learn more about our projects on the [docs site](https://useboomerang.io/docs).

View current project work in our [community roadmap repo](https://github.com/boomerang-io/roadmap).

## Getting Started with Vite

This project was bootstrapped with [Vite](https://github.com/vitejs/vite).

## RUN ENTIRE APP LOCALLY

### Kubernetes

1. `kubectl create ns workflows`
2. `kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml`
3. `helm repo add boomerang-io https://raw.githubusercontent.com/boomerang-io/charts/index`
4. ` helm repo add bitnami-pre-2022 https://raw.githubusercontent.com/bitnami/charts/eb5f9a9513d987b519f0ecd732e7031241c50328/bitnami`
5. `helm upgrade --version 7.8.8 --install mongodb -n workflows bitnami-pre-2022/mongodb --set mongodbDatabase=boomerang --set mongodbUsername=boomerang`
6. `docker pull docker pull --platform linux/amd64  boomerangio/{flow-service-handler:7.0.0-beta.24,flow-service-engine:1.0.0-beta.79,flow-service-workflow:4.0.0-beta.197}`
7. `helm upgrade --install workflows -n workflows -f ./flowabl-dev-5.1.0-values.yaml boomerang-io/bmrg-flow --version 5.1.7`
8. `kubectl get secret --namespace workflows mongodb -o jsonpath="{.data.mongodb-password}" | base64 --decode | pbcopy
9. `mongorestore --uri mongodb://boomerang:gxRIMQonNu@localhost:27018/boomerang --drop --nsInclude 'boomerang.*' db-backups/flowabl-dev-dump-20230111/boomerang`
10. `kubectl create secret docker-registry boomerang.registrykey -n workflows --docker-server='https://index.docker.io/v1/' --docker-username='tlawrie' --docker-password='dckr_pat_jqoiQexTUY5mtnuSP5hVjnghBNc' --docker-email='tyson@lawrie.com.au'`

### Set up Database

1. Create `flowabl_users` collection
2. Create user

```json
{
  "name": "Tim",
  "email": "tim@test.com",
  "type": "user",
  "status": "active"
}
```

3. Create global token

POST `http://<workflow-service>/internal/debug/token`

```json
{
  "type": "global",
  "name": "global-test-token",
  "permissions": ["**/**/**"]
}
```

3. Create user token

POST `http://<workflow-service>/api/v2/token`

```json
{
    "type": "user",
    "name": "test-token-user",
    "principal": "<user-id>"
}
```

### Port Forwarding

1. `kubectl port-forward svc/flowabl-services-workflow 8081:80 -n workflows`
2. Export token

export AUTH_JWT=<user_token>

3. `npm run start:pf`
