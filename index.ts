export type KeyMapping<T> = {
  key: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: (...args: any[]) => any;
};

export type KeyMappingNode<T> = {
  add: (nextKeyMapping: KeyMapping<T>) => KeyMappingNode<T>;
  get: (key: T) => KeyMappingNode<T> | undefined;
  mapping: KeyMapping<T>;
  remove: (key: T) => boolean;
};

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
  const mapping = keyMapping;
  const nextMapping = new Map<T, KeyMappingNode<T>>();

  /* TODO: prototype */

  const add: KeyMappingNode<T>['add'] = (nextKeyMapping) => {
    const nextKeyMappingNode = createKeyMappingNode(nextKeyMapping);

    nextMapping.set(nextKeyMappingNode.mapping.key, nextKeyMappingNode);

    return nextKeyMappingNode;
  };

  const get: KeyMappingNode<T>['get'] = (key) => {
    return nextMapping.get(key);
  };

  const remove: KeyMappingNode<T>['remove'] = (key) => {
    return nextMapping.delete(key);
  };

  return {
    add,
    get,
    mapping,
    remove
  };
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

  for (let i = 0, len = keyMappings.length; i < len; i += 1) {
    const keyMapping = keyMappings[i];

    if (!keyMapping) {
      return;
    }

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

  for (let i = 0, len = keys.length; i < len; i += 1) {
    const key = keys[i];

    if (!key) {
      break;
    }

    keyMappingNode = keyMappingNode ? get(key, keyMappingNode) : get(key);
  }

  return keyMappingNode;
}
