/*
 * MIT License
 *
 * Copyright (c) 2020 Hiberbee
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import os from 'os'
import path from 'path'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { addPath, exportVariable, getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import { downloadTool } from '@actions/tool-cache'
import { mkdirP, mv } from '@actions/io'
import { restoreCache, saveCache } from '@actions/cache'
import { exists } from '@actions/io/lib/io-util'

/**
 * Downloads file from url and extracts if archive detected
 * @param url
 * @param destination
 */
async function download(url: string, destination: string): Promise<string> {
  const downloadPath = await downloadTool(url)
  const destinationDir = path.dirname(destination)
  await mkdirP(destinationDir)
  if (url.endsWith('tar.gz') || url.endsWith('tar') || url.endsWith('tgz')) {
    await exec('tar', ['-xzvf', downloadPath, `--strip=1`])
    await mv(path.basename(destination), destinationDir)
  } else {
    await mv(downloadPath, destination)
  }
  await exec('chmod', ['+x', destination])
  addPath(destinationDir)
  return downloadPath
}

async function run(): Promise<void> {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat.toLowerCase()
  const helmVersion = getInput('helm-version')
  const helmfileVersion = getInput('helmfile-version')
  const repositoryConfig = getInput('repository-config')
  const helmfileFile = getInput('helmfile-file')
  const helmUrl = `https://get.helm.sh/helm-v${helmVersion}-${platform}-amd64.tar.gz`
  const helmfileUrl = `https://github.com/roboll/helmfile/releases/download/v${helmfileVersion}/helmfile_${platform}_amd64`
  const binPath = `${process.env.HOME}/bin`
  const cachePath = `${process.env.HOME}/.cache`
  const helmCachePath = `${cachePath}/helm`
  const repositoryConfigPath = `${process.env.GITHUB_WORKSPACE}/${repositoryConfig}`
  const helmfilePath = `${process.env.GITHUB_WORKSPACE}/${helmfileFile}`
  exportVariable('XDG_CACHE_HOME', cachePath)

  const hash = createHash('sha256')
  try {
    await mkdirP(helmCachePath)
    const repositoryArgs = await exists(repositoryConfigPath) ? ['--repository-config', repositoryConfigPath] : []

    await download(helmUrl, `${binPath}/helm`)
    await download(helmfileUrl, `${binPath}/helmfile`)
    if (repositoryArgs.length > 0) {
      const hashSum = hash.update(readFileSync(repositoryConfigPath)).digest('hex')
      const restoredFromCache = await restoreCache([helmCachePath], hashSum)
      await exec('helm', ['repo', 'update'].concat(repositoryArgs))
      if (restoredFromCache === undefined) {
        await saveCache([helmCachePath], hashSum)
      }
    }
    if (getInput('helmfile-command') !== '' && await exists(helmfilePath)) {
      await exec('helmfile', getInput('helmfile-command').split(' ').concat(['--file', helmfilePath]))
    } else if (getInput('helm-command') !== '') {
      await exec('helm', getInput('helm-command').split(' ').concat(repositoryArgs))
    }
  } catch (error) {
    setFailed(error.message)
  }
}

// noinspection JSIgnoredPromiseFromCall
run()
