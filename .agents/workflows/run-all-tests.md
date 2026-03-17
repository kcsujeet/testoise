---
description: Run all package tests across frameworks
---

To run all tests (Core, Bun, Vitest, Jest, React, Vue), execute the following:

// turbo-all
1. Run Bun tests
```bash
bun test tests/bun.test.ts
```

2. Run Jest tests
```bash
bun x jest tests/jest.test.ts
```

3. Run Vitest tests (Core + React + Vue)
```bash
bun x vitest run tests/vitest.test.ts tests/react.test.tsx tests/vue.test.ts
```
