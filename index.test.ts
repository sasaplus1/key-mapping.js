import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { createKeyMapping, getKeyMapping, addKeyMappings } from './index';

describe('key-mapping', function () {
  it('should can add and get', function () {
    const root = createKeyMapping({ key: '' });

    root
      .add({ key: 'A' })
      .add({ key: 'B' })
      .add({ key: 'C', action() {} });

    const keyMapping = root.get('A')?.get('B')?.get('C');

    assert.deepStrictEqual(keyMapping?.mapping?.key, 'C');
    assert.deepStrictEqual(typeof keyMapping?.mapping?.action, 'function');
  });
  it('should can add and get with utility functions', function () {
    const root = createKeyMapping({ key: '' });

    addKeyMappings(
      [{ key: 'A' }, { key: 'B' }, { key: 'C', action() {} }],
      root
    );

    const keyMapping = getKeyMapping(['A', 'B', 'C'], root);

    assert.deepStrictEqual(keyMapping?.mapping?.key, 'C');
    assert.deepStrictEqual(typeof keyMapping?.mapping?.action, 'function');
  });
});
