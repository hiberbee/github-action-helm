# Helm Github Action

Install Helm, Helmfile, update repositories if provided and optionally executes Helm command

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
