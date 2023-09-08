# key-mapping

store key mappings

## Usage

```ts
import { createKeyMapping } from 'key-mapping';

const root = createKeyMapping({ key: '' });

root
  .add({ key: 'A' })
  .add({ key: 'B', action() { console.log('Hello!'); } });

root.get('A')?.get('B')?.mapping?.action?.(); // => Hello!
```

or

```ts
import { createKeyMapping } from 'key-mapping';

const root = createKeyMapping({ key: '' });

const keyMappings = [
  { key: 'A' },
  { key: 'B', action() { console.log('Hello!'); } }
];

addKeyMappings(keyMappings, root);
getKeyMapping(['A', 'B'], root)?.mapping?.action?.(); // => Hello!
```

## License

The MIT license
