# Helm Github Action

<p align="center">
  <img src="https://img.shields.io/github/license/hiberbee/github-action-helm?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/workflow/status/hiberbee/github-action-helm/CI?label=github-actions&style=flat-square" alt="GitHub Action Status">
  <img src="https://img.shields.io/github/v/tag/hiberbee/github-action-helm?label=hiberbee%2Fgithub-action-helm&style=flat-square" alt="GitHub Workflow Version">
</p>

Install Helm 3.6.3, Helmfile 0.140.0, update repositories if repositories config provided, and optionally executes Helm or Helmfile command

## Example

### Helm workflow

```yaml
name: CI
on: push
jobs:
  helm:
    name: Helm
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout sources
        uses: actions/checkout@main

      - name: Get repositories
        uses: hiberbee/github-action-helm@1.3.0
        with:
          helm-command: repo list
          repository-config: test/repositories.yaml

      - name: Lint chart
        run: helm lint nginx
        working-directory: test/charts

      - name: Install release
        uses: hiberbee/github-action-helm@latest
        with:
          helm-command: upgrade --install --dry-run nginx test/charts/nginx

```

### Helmfile workflow

```yaml
name: Helmfile CI
on: push
jobs:
  helmfile:
    name: Helmfile
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout sources
        uses: actions/checkout@main

      - name: Setup K8s cluster
        uses: hiberbee/github-action-minikube@1.5.0

      - name: Apply Helmfile
        uses: hiberbee/github-action-helm@1.3.0
        with:
          helmfile-command: apply
          helmfile-config: test/helmfile.yaml

      - name: Get ingresses
        run: kubectl get ingress

```

## Repositories config example

By default this Github Action expects `repositories.yaml` created in repository root directory.
Before updating repositories file existance will be checked.
If you want to override, use `repository-config` input argument

```yaml
apiVersion: v2

repositories:
  - name: stable
    url: https://kubernetes-charts.storage.googleapis.com
    caFile: ""    # optional
    certFile: ""  # optional
    keyFile: ""   # optional
    password: ""  # optional
    username: ""  # optional
```
