export type KeyMapping<T> = {
  key: T;
  action?: () => void;
};

export type KeyMappingNode<T> = {
  add: (nextKeyMapping: KeyMapping<T>) => KeyMappingNode<T>;
  get: (key: T) => KeyMappingNode<T> | undefined;
  // TODO: remove
  mapping: KeyMapping<T>;
};

/**
 * create key mapping node
 *
 * @param keyMapping - key mapping
 * @returns key mapping node
 * @example
 * ```ts
 * const root = createKeyMapping({ key: "" });
 *
 * root
 *   .add({ key: "A" })
 *   .add({ key: "B", action() { console.log("Hello!"); } });
 *
 * root.get("A")?.get("B")?.mapping?.action?.(); // => Hello!
 * ```
 */
export function createKeyMapping<T>(
  keyMapping: KeyMapping<T>
): KeyMappingNode<T> {
  const mapping = keyMapping;
  const nextMapping = new Map<T, KeyMappingNode<T>>();

  const add: KeyMappingNode<T>['add'] = (nextKeyMapping) => {
    const nextKeyMappingNode = createKeyMapping(nextKeyMapping);

    nextMapping.set(nextKeyMappingNode.mapping.key, nextKeyMappingNode);

    return nextKeyMappingNode;
  };

  const get: KeyMappingNode<T>['get'] = (key) => {
    return nextMapping.get(key);
  };

  return {
    add,
    get,
    mapping
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
 * const root = createKeyMapping({ key: "" });
 *
 * addKeyMappings([{ key: "A" }, { key: "B", action() { console.log("Hello!"); } }], root);
 * getKeyMapping(["A", "B"], root)?.mapping?.action?.(); // => Hello!
 * ```
 */
export function addKeyMappings<T>(
  keyMappings: KeyMapping<T>[],
  root: KeyMappingNode<T>
): void {
  const firstKeyMapping = keyMappings[0];

  if (!firstKeyMapping) {
    return;
  }

  let keyMappingNode: KeyMappingNode<T> = root.add(firstKeyMapping);

  for (let i = 1, len = keyMappings.length; i < len; i += 1) {
    const keyMapping = keyMappings[i];

    if (!keyMapping) {
      return;
    }

    keyMappingNode = keyMappingNode.add(keyMapping);
  }
}

/**
 * get key mapping
 * it is utility function
 *
 * @param keys - mapping keys
 * @param root - root key mapping node
 * @returns key mapping node if exist, otherwise undefined
 * @example
 * ```ts
 * const root = createKeyMapping({ key: "" });
 *
 * addKeyMappings([{ key: "A" }, { key: "B", action() { console.log("Hello!"); } }], root);
 * getKeyMapping(["A", "B"], root)?.mapping?.action?.(); // => Hello!
 * ```
 */
export function getKeyMapping<T>(
  keys: T[],
  root: KeyMappingNode<T>
): KeyMappingNode<T> | undefined {
  const firstKey = keys[0];

  if (!firstKey) {
    return;
  }

  let keyMapping: KeyMappingNode<T> | undefined = root.get(firstKey);

  for (let i = 1, len = keys.length; i < len; i += 1) {
    const key = keys[i];

    if (!keyMapping || !key) {
      break;
    }

    keyMapping = keyMapping.get(key);
  }

  return keyMapping;
}
