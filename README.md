# Helm Github Action

<p align="center">
  <img src="https://img.shields.io/github/license/hiberbee/github-action-helm?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/workflow/status/hiberbee/github-action-helm/CI?label=github-actions&style=flat-square" alt="GitHub Action Status">
  <img src="https://img.shields.io/github/v/tag/hiberbee/github-action-helm?label=hiberbee%2Fgithub-action-helm&style=flat-square" alt="GitHub Workflow Version">
</p>

Install Helm 3.3.0, Helmfile 0.125.7, update repositories if repositories config provided, and optionally executes Helm or Helmfile command

## Example

```yaml
name: Helm
on: push
jobs:
  helm:
    name: Bootstrap
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout sources
        uses: actions/checkout@main
      - name: Get Helm repositories
        uses: hiberbee/github-action-helm@latest
        with:
          helm-command: repo list
      - name: Get Helmfile version
        uses: hiberbee/github-action-helm@latest
        with:
          helmfile-command: lint

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
