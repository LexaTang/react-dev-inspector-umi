/**
 * preset plugins for umi3
 */

import type { IApi as IApi3 } from '@umijs/types'
import type { IApi as IApi4 } from 'umi4'
import {
  createLaunchEditorMiddleware,
} from '../webpack'

export default function inspectorPlugin(api: IApi3 | IApi4) {
  const inspectorConfig = api.userConfig.inspectorConfig

  api.describe({
    key: 'inspectorConfig',
    config: {
      schema(joi) {
        return joi.object()
      },
    },
  })
  if ((api as IApi4).addBeforeBabelPlugins) {
    const api4 = api as IApi4
    api.logger.info(`Using react-dev-inspector Umi4 plugin with Umi ${process.env.UMI_VERSION}.`)
    api4.addBeforeBabelPlugins(() => [
      [
        require.resolve('@react-dev-inspector/babel-plugin'),
        {
          cwd: inspectorConfig?.cwd,
          excludes: [
            /\.umi(-production)?\//,
            ...inspectorConfig?.excludes ?? [],
          ],
        },
      ],
    ])
    api4.addBeforeMiddlewares(createLaunchEditorMiddleware)
  } else if ((api as IApi3).modifyBabelOpts) {
    const api3 = api as IApi3
    api.logger.info(`Using react-dev-inspector Umi3 plugin with Umi ${process.env.UMI_VERSION}.`)
    api3.modifyBabelOpts((babelOptions) => {
      babelOptions.plugins.unshift([
        'react-dev-inspector/plugins/babel',
        {
          cwd: inspectorConfig?.cwd,
          excludes: [
            /\.umi(-production)?\//,
            ...inspectorConfig?.excludes ?? [],
          ],
        },
      ])
      return babelOptions
    })
    api3.addBeforeMiddewares(createLaunchEditorMiddleware)
  }

}
