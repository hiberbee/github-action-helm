# Helm Github Action

Install Helm, Helmfile, update repositories if provided and optionally executes Helm command

## Example

```yaml
name: Helm
on: push
jobs:
  helm:
    name: Bootstrap Helm
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout sources
        uses: actions/checkout@main
      - name: Setup Helm
        uses: hiberbee/github-action-helm@latest
```
