# key-mapping

store key mappings

## Usage

```ts
import { createKeyMappingNode } from 'key-mapping';

const root = createKeyMappingNode({ key: '' });

root.add({ key: 'A' }).add({
  key: 'B',
  action() {
    console.log('Hello!');
  }
});

root.get('A')?.get('B')?.mapping?.action?.(); // => Hello!
```

or

```ts
import {
  createKeyMappingNode,
  addKeyMappings,
  getKeyMappingNode
} from 'key-mapping';

const root = createKeyMappingNode({ key: '' });

const keyMappings = [
  { key: 'A' },
  {
    key: 'B',
    action() {
      console.log('Hello!');
    }
  }
];

addKeyMappings(keyMappings, root);
getKeyMappingNode(['A', 'B'], root)?.mapping?.action?.(); // => Hello!
```

## License

The MIT license
