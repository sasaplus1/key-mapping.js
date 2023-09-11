export type KeyMapping<T> = {
  key: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: (...args: any[]) => any;
};

export class KeyMappingNode<T> {
  private nextMapping: Map<T, KeyMappingNode<T>>;

  constructor(public mapping: KeyMapping<T>) {
    this.nextMapping = new Map();
  }

  /**
   * add key mapping node
   *
   * @param nextKeyMapping - next key mapping
   * @returns next key mapping node
   */
  add(nextKeyMapping: KeyMapping<T>): KeyMappingNode<T> {
    const nextKeyMappingNode = new KeyMappingNode(nextKeyMapping);

    this.nextMapping.set(nextKeyMappingNode.mapping.key, nextKeyMappingNode);

    return nextKeyMappingNode;
  }

  /**
   * get key mapping node
   *
   * @param key - key
   * @returns key mapping node if exist, otherwise undefined
   */
  get(key: T): KeyMappingNode<T> | undefined {
    return this.nextMapping.get(key);
  }

  /**
   * remove key mapping node
   *
   * @param key - key
   * @returns true if key mapping node exist, otherwise false
   */
  remove(key: T): boolean {
    return this.nextMapping.delete(key);
  }
}

/**
 * create key mapping node
 *
 * @param keyMapping - key mapping
 * @returns key mapping node
 * @example
 * ```ts
 * const root = createKeyMappingNode({ key: "" });
 *
 * root
 *   .add({ key: "A" })
 *   .add({ key: "B", action() { console.log("Hello!"); } });
 *
 * root.get("A")?.get("B")?.mapping?.action?.(); // => Hello!
 * ```
 */
export function createKeyMappingNode<T>(
  keyMapping: KeyMapping<T>
): KeyMappingNode<T> {
  return new KeyMappingNode(keyMapping);
}

/**
 * add key mappings
 * it is utility function
 *
 * @param keyMappings - key mappings
 * @param root - root key mapping node
 * @returns last key mapping node
 * @example
 * ```ts
 * const root = createKeyMappingNode({ key: "" });
 *
 * addKeyMappings([{ key: "A" }, { key: "B", action() { console.log("Hello!"); } }], root);
 * getKeyMappingNode(["A", "B"], root)?.mapping?.action?.(); // => Hello!
 * ```
 */
export function addKeyMappings<T>(
  keyMappings: KeyMapping<T>[],
  root: KeyMappingNode<T>
): void {
  // if key mapping exist, use it
  const get = (
    keyMapping: KeyMapping<T>,
    keyMappingNode: KeyMappingNode<T> = root
  ): KeyMappingNode<T> =>
    keyMappingNode.get(keyMapping.key) || keyMappingNode.add(keyMapping);

  let keyMappingNode: KeyMappingNode<T> | undefined = undefined;

  for (const keyMapping of keyMappings) {
    keyMappingNode = keyMappingNode
      ? get(keyMapping, keyMappingNode)
      : get(keyMapping);
  }
}

/**
 * get key mapping node
 * it is utility function
 *
 * @param keys - mapping keys
 * @param root - root key mapping node
 * @returns key mapping node if exist, otherwise undefined
 * @example
 * ```ts
 * const root = createKeyMappingNode({ key: "" });
 *
 * addKeyMappings([{ key: "A" }, { key: "B", action() { console.log("Hello!"); } }], root);
 * getKeyMappingNode(["A", "B"], root)?.mapping?.action?.(); // => Hello!
 * ```
 */
export function getKeyMappingNode<T>(
  keys: T[],
  root: KeyMappingNode<T>
): KeyMappingNode<T> | undefined {
  // get key mapping node
  const get = (
    key: T,
    keyMappingNode: KeyMappingNode<T> = root
  ): KeyMappingNode<T> | undefined => keyMappingNode.get(key);

  let keyMappingNode: KeyMappingNode<T> | undefined = undefined;

  for (const key of keys) {
    keyMappingNode = keyMappingNode ? get(key, keyMappingNode) : get(key);
  }

  return keyMappingNode;
}
