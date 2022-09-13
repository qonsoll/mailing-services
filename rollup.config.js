import _ from 'lodash'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import mainPkg from './package.json'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
// Importing plugins for rollup.
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const buildFolder = 'dist'

// Creating reference map between subpackage name and it folder name in hooks folder.
const subpackages = [
  { path: 'useFirebase', name: 'firebase' },
  { path: 'useAuthServices', name: 'auth' },
  { path: 'useDatabaseServices', name: 'database' },
  { path: 'useFirestoreServices', name: 'firestore' },
  { path: 'useStorageServices', name: 'storage' }
]

// Declaring peer dependencies for package. Get some from main package.json and add additional dependencies.
const peerDependencies = mainPkg.peerDependencies || {}
const external = [
  ...Object.keys(peerDependencies),
  'react-dom',
  'firebase/auth',
  'firebase/database',
  'firebase/firestore',
  'firebase/storage'
]

// Configure additional plugins for build
const plugins = [
  peerDepsExternal(), // peerDepsExternal plugin doing magic with dependencies and package size reduce twice.
  terser(), // terser plugin doing code uglify and package size reduce twice.
  commonjs(),
  resolve()
]

const copyPluginConfig = subpackages.map(({ name, path }) => {
  const sourceInputPath = `src/hooks/${path}`

  return copy({
    targets: [
      // Copy package.json files into build folder to be able imports "subpackages"
      {
        src: `${sourceInputPath}/package.json`,
        dest: name
      }
    ]
  })
})

/*
 * Build script.
 *
 * First argument is config for main index.ts which includes imports from all subpackages
 * and main declaration file which include declaration from subpackages.
 * Second argument is generated build config for each subpackage.
 *
 * All values from map pass to lodash "merge" function to concat same fields into one config object to
 * implement multiple source inputs in rollup(which in this way build package separately into different chunks,
 * not into one index.esm.js file)
 *
 */
export default _.merge(
  [
    /*
     *  Build main index to be able import all hooks or components you want from one place.
     */
    {
      input: {
        [`${buildFolder}/index.esm`]: 'src/index.js'
      },
      /*
       *  To enable code splitting(chunks) in config need to be set output.dir, not output.file.
       *  And set chunkFileName to define how rollup will named chunks.
       */
      output: {
        dir: './',
        format: 'es',
        chunkFileNames: `${buildFolder}/esm/[name].js`
      },
      plugins: [...plugins, ...copyPluginConfig],
      external
    },
    {
      input: {
        [`${buildFolder}/index.cjs`]: 'src/index.js'
      },
      output: {
        dir: './',
        format: 'cjs',
        chunkFileNames: `${buildFolder}/cjs/[name].js`
      },
      plugins: [...plugins, ...copyPluginConfig],
      external
    }
  ],
  ...subpackages.map(({ name, path }) => {
    // There is path to subpackage source folder.
    const sourceInputPath = `src/hooks/${path}`

    // Write here only fields which are different from main config and need to be concat with it.
    return [
      {
        input: {
          [`${name}/${buildFolder}/index.esm`]: `${sourceInputPath}/index.js`
        }
      },
      {
        input: {
          [`${name}/${buildFolder}/index.cjs`]: `${sourceInputPath}/index.js`
        }
      }
    ]
  })
)