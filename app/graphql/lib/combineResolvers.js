import merge from 'deepmerge'
export const combineResolvers = (resolvers) => {
    return merge.all(resolvers)
}