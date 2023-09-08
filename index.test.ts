import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import {
  createKeyMappingNode,
  getKeyMappingNode,
  addKeyMappings
} from './index';

describe('key-mapping', function () {
  it('should can add and get', function () {
    const root = createKeyMappingNode({ key: '' });

    root
      .add({ key: 'A' })
      .add({ key: 'B' })
      .add({ key: 'C', action() {} });

    const keyMapping = root.get('A')?.get('B')?.get('C');

    assert.deepStrictEqual(keyMapping?.mapping?.key, 'C');
    assert.deepStrictEqual(typeof keyMapping?.mapping?.action, 'function');
  });
  it('should can add and get with utility functions', function () {
    const root = createKeyMappingNode({ key: '' });

    addKeyMappings(
      [{ key: 'A' }, { key: 'B' }, { key: 'C', action() {} }],
      root
    );

    const keyMapping = getKeyMappingNode(['A', 'B', 'C'], root);

    assert.deepStrictEqual(keyMapping?.mapping?.key, 'C');
    assert.deepStrictEqual(typeof keyMapping?.mapping?.action, 'function');
  });
});
