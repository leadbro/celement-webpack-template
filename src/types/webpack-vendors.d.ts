declare module '@csstools/postcss-global-data' {
  interface Options {
    files: string[]
  }
  function postcssGlobalData(options: Options): unknown
  export default postcssGlobalData
}
