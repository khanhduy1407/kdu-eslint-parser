export type VisitorKeys = Readonly<{
    [type: string]: ReadonlyArray<string> | undefined
}>

declare const evk: {
    KEYS: VisitorKeys,
    getKeys(node: { type: string }): ReadonlyArray<string>,
    unionWith(keys: VisitorKeys): VisitorKeys
}
export default evk
