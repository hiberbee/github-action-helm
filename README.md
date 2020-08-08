# Github Action NodeJS Template

Executes command with arguments

## Example 

```yaml
name: Github Action example workflow
on: push
jobs:
  command:
    name: Exec command
    runs-on: ubuntu-latest
    steps:
      - name: NodeJS command
        uses: hiberbee/template-github-action-nodejs@master
        with:
          command: docker
          arguments: ps -a

```
