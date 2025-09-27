# 测试

测试的内容很庞大，测试一般可分为**单元测试**，**组件测试**，**端对端测试**。

- **单元测试**：检查给定函数、类或组合式函数的输入是否产生预期的输出或副作用。
- **组件测试**：检查你的组件是否正常挂载和渲染、是否可以与之互动，以及表现是否符合预期。这些测试比单元测试导入了更多的代码，更复杂，需要更多时间来执行。
- **端到端测试**：检查跨越多个页面的功能，并对生产构建的 Vue 应用进行实际的网络请求。这些测试通常涉及到建立一个数据库或其他后端。





**那为什么需要测试呢？**

自动化测试能够预防无意引入的 bug，并鼓励开发者将应用分解为可测试、可维护的函数、模块、类和组件。这能够帮助你和你的团队更快速、自信地构建复杂的应用。任何应用都可能会以多种方式崩溃，因此，在发布前发现并解决这些问题就变得十分重要。



**作为前端，我们应该掌握哪一些内容呢？**

- **目标**：测试独立的函数、工具类、纯逻辑模块，组件。也就是掌握单元测试和组件测试
- 应掌握
  - 使用 `expect` 断言常见数据类型（字符串、数字、对象、数组）。
  - 使用 `describe` 和 `test` 组织测试用例。
  - 模拟函数（`vi.fn()`）、模块（`vi.mock()`）和定时器。
  - 编写可测试的纯函数和解耦的业务逻辑。
  - 对组件的测试
- 典型场景
  - 工具函数（如 `formatDate`, `calculatePrice`）。
  - Vuex/Pinia 的 actions、getters。
  - React Hooks 的自定义逻辑
  - 各种组件各种场景下的测试





**业务中测试的边界在哪里？**

 当组件有“业务逻辑”或“复杂交互”时，才值得测试



| 类型                                            | 是否建议测试 | 说明                                                         |
| ----------------------------------------------- | ------------ | ------------------------------------------------------------ |
| 🔴 纯展示组件（如 `<Icon />`, `<Button />`）     | ❌ 一般不测   | 如果是通用组件库（如 Element Plus），需要测；如果是业务项目中的简单封装，不值得。 |
| 🟡 容器组件 / 页面组件（如 `UserProfile.vue`）   | ✅ 建议测     | 通常包含逻辑、状态、副作用。                                 |
| 🟡 有业务逻辑的组合式函数（如 `useCartTotal()`） | ✅ 建议测     | 逻辑复杂、影响计价，必须保护。                               |
| 🟢 简单的工具函数（如 `formatDate()`）           | ⚠️ 可选       | 如果是通用工具库，建议测；如果是项目内小函数，可不测。       |
| 🔴 简单的 `v-if` / `v-show` 条件渲染             | ❌ 不建议测   | 测试框架行为是浪费。                                         |

**测试的边界 = 保护“业务逻辑”和“关键路径”**

就是核心业务逻辑，复杂状态管理，副作用，集成点应该测试

| 类型         | 示例                                      | 为什么测                         |
| ------------ | ----------------------------------------- | -------------------------------- |
| 核心业务逻辑 | 计算价格、折扣、积分、权限                | 出错会直接导致金钱损失或安全问题 |
| 复杂状态管理 | 购物车、表单验证、多步骤流程              | 状态容易出错，影响用户体验       |
| 副作用       | 调用 API、发 Analytics、修改 localStorage | 外部依赖，容易出问题             |
| 集成点       | 组件之间通信、与 Pinia/Router 交互        | 接口容易断裂                     |



所以到底怎么知道测不测呢？

按照下面这三个问题走

1. **如果这个逻辑出错，会影响用户或公司收入吗？**
   - 是 → 测
   - 否 → 不测
2. **这个逻辑复杂吗？容易出错吗？**
   - 是 → 测
   - 否 → 不测
3. **这个逻辑会频繁变更吗？**
   - 是 → 测（防止 regression）
   - 否 → 可不测



我们先从vitest开始说起。



# vitest

vitest背后测试的内容过于庞大，如果想要真正的入门测试，可能需要专门学一个星期以上。但是，暂时没有这么多的时间，而且现在ai过于强大，ai写测试文件也是非常强大，所以本文件仅是对vitest一个基本了解。

阅读前请阅读vue官方的测试指南：[测试 | Vue.js](https://cn.vuejs.org/guide/scaling-up/testing.html)



## 1.什么是Vitest

1. **极速启动与运行**：
   - **基于 Vite**：Vitest 直接利用 Vite 的原生 ES 模块（ESM）支持和按需编译能力，无需像传统测试框架（如 Jest）那样进行完整的打包过程。这使得测试启动速度极快，接近瞬时启动。
   - **按需执行**：只编译和运行当前需要的测试文件，极大地提升了开发过程中的反馈速度。
2. **与 Vite 零配置集成**：
   - 如果你的项目已经使用 Vite，Vitest 可以无缝集成，通常只需安装并进行极少的配置（甚至无需配置）即可开始测试。
   - 它共享 Vite 的 `vite.config.js` 文件，自动继承项目中的别名（aliases）、插件（plugins）和环境变量等配置，避免了重复设置。
3. **支持现代 JavaScript/TypeScript**：
   - 开箱即支持 ES 模块、TypeScript、JSX 等现代语法，无需额外配置 Babel 或 TypeScript 编译器（除非有特殊需求）。
4. **Jest 兼容 API**：
   - Vitest 的 API 设计高度兼容 Jest，熟悉 Jest 的开发者可以非常平滑地迁移。它支持 `describe`, `test` (`it`), `expect`, `beforeEach`, `afterEach`, `vi` (用于模拟) 等常用 API。
   - 这使得将现有 Jest 测试迁移到 Vitest 变得相对容易。







## 2.快速上手

建议使用vue-create然后选择vitest配置，默认会帮你安装后

```
pnpm create vue
```

如果你想在自己安装vitest，请安装

```
pnpm i vitest -D
```

如果你需要对组件进行测试，请下载下面的包

```
pnpm i -D jsdom @vue/test-utils
```

然后进行一些简单的配置（在vitest.config.js,vite.config.js文件里面配置）

```
{
  test: {
    /* 环境 */
    environment: "jsdom",
    /* 启动全局API */
    globals: true,
    /* 这些是设置文件   setup 文件的路径。它们将运行在每个测试文件之前。*/
    setupFiles: ["./tests/setup.js"],
  }
}
```

可以配置以下脚本

```
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui" // 需要先安装 @vitest/ui 包
  }
}
```



然后就可以写测试文件

```
import { expect, test } from "vitest";

test("add", () => {
  const add = (a, b) => a + b;
  expect(add(1, 2)).toBe(3);
});
```



使用ts还需要怎么设置呢？

如果你的文件结构使用`__test__`

那么不需要任何设置

但是如果你开启了globals: true的设置，就要做以下配置

在tsconfig.app.json文件里面

```json
{
  "extends": "./tsconfig.app.json",
  "include": ["src/**/__tests__/*", "env.d.ts"],
  "exclude": [],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.vitest.tsbuildinfo",
    "lib": [],
    "types":["node", "jsdom","vitest/globals"],//!!!添加这一行
  }
}

```



如果你的文件结构将所有的测试文件都单独的写在test文件夹下，那么你就要添加下面的配置

tsconfig.vitest.json

```json
{
  "extends": "./tsconfig.app.json",
  "include": ["src/**/__tests__/*", "env.d.ts","tests/**/*"],
  "exclude": [],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.vitest.tsbuildinfo",
    "lib": [],
    "types": ["node", "jsdom","vitest/globals"],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

```





**快速上手测试组合式函数**

> 这一小节假设你已经读过了[组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)这一章。

当涉及到测试组合式函数时，我们可以根据是否依赖宿主组件实例把它们分为两类。

当一个组合式函数使用以下 API 时，它依赖于一个宿主组件实例：

- 生命周期钩子
- 供给/注入

如果一个组合式程序只使用响应式 API，那么它可以通过直接调用并断言其返回的状态或方法来进行测试。

counter.js

```js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

counter.test.js

```js
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

一个依赖生命周期钩子或供给/注入的组合式函数需要被包装在一个宿主组件中才可以测试。我们可以创建下面这样的帮手函数：

test-utils.js

```js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // 忽略模板警告
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // 返回结果与应用实例
  // 用来测试供给和组件卸载
  return [result, app]
}
```

foo.test.js

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // 为注入的测试模拟一方供给
  app.provide(...)
  // 执行断言
  expect(result.foo.value).toBe(1)
  // 如果需要的话可以这样触发
  app.unmount()
})
```

对于更复杂的组合式函数，通过使用[组件测试](https://cn.vuejs.org/guide/scaling-up/testing.html#component-testing)编写针对这个包装器组件的测试，这会容易很多。





## 3.配置



| 配置项            | 说明                                                         | 常用值/示例                                      |
| :---------------- | :----------------------------------------------------------- | :----------------------------------------------- |
| **`environment`** | 指定测试运行的环境。测试 DOM 相关组件时需要模拟浏览器环境。  | `'jsdom'`（最常用）或 `'happy-dom'`              |
| **`globals`**     | 是否全局注入 `describe`, `it`, `expect`等 API。开启后无需在每个测试文件内导入。 | `true`                                           |
| **`include`**     | 指定哪些文件被识别为测试文件。                               | `['**/*.{test,spec}.{js,ts,jsx,tsx}']`           |
| **`exclude`**     | 指定排除哪些文件或目录不进行测试。                           | `['**/node_modules/**', '**/dist/**']`           |
| **`setupFiles`**  | 指定一个或多个配置文件，用于在测试运行前设置测试环境（如全局引入扩展断言库）。 | `'./tests/setup.ts'`或 `'./vitest.setup.ts'`     |
| **`coverage`**    | 配置测试覆盖率报告。                                         | `{ provider: 'v8', reporter: ['text', 'html'] }` |
| **`alias`**       | 路径别名解析。确保 Vitest 能正确解析你在 Vite 中配置的别名。 | 通常与 Vite 配置中的 `resolve.alias`保持一致     |



**重要配置：**

1. **测试环境 (`environment`)**

   这是最关键配置之一。如果你的测试涉及浏览器 API（如 `document`, `window`）或 Vue/React 组件，必须设置为 `'jsdom'`来模拟浏览器环境。对于纯逻辑函数的测试，可以使用默认的 `'node'`环境 

2. **覆盖率配置 (`coverage`)**

   - `provider`: 推荐使用 `'v8'`，它是现代且高性能的选择 
   - `reporter`: 指定报告格式。`'text'`用于命令行简要输出，`'html'`会生成一个可详细浏览的 HTML 报告文件，`'json'`便于 CI 工具集成 
   - `thresholds`: 可在 `coverage`下设置覆盖率阈值，作为质量门禁，例如 `{ lines: 80, functions: 80, branches: 70 }`

3. **设置文件 (`setupFiles`)**

   强烈建议创建一个设置文件（如 `vitest.setup.ts`），用于全局引入一些测试所需的库或进行全局设置。一个典型的内容是引入 `@testing-library/jest-dom`提供的扩展断言方法（如 `toBeInTheDocument`）

   ```
   // vitest.setup.ts
   import '@testing-library/jest-dom/vitest';
   ```

4. **并行运行测试**

   ```
   // 并行运行测试
   threads: true,
   ```



## 4.单元测试



Vitest 是一个由 Vite 驱动的高性能前端测试框架，它兼容 Jest 的 API，这意味着如果你熟悉 Jest，上手 Vitest 会非常快。它的语法设计得非常直观、易于阅读，接近自然语言。

下面我将从基础结构、断言、生命周期钩子、Mocking（模拟）等方面，为你详细拆解 Vitest 的核心语法。

------



### 1. 基础测试结构 (Basic Structure)



一个标准的测试文件通常由 `describe`, `it` (或 `test`), 和 `expect` 构成。

- `describe(name, fn)`: 用于创建一个测试套件（Test Suite），将一组相关的测试组织在一起。它可以嵌套，形成层次分明的测试结构。
  - `name` (string): 测试套件的描述性名称。
  - `fn` (function): 包含具体测试用例（`it` 块）的函数。
- `it(name, fn)` 或 `test(name, fn)`: 定义一个具体的测试用例（Test Case）。`it` 和 `test` 是完全等价的，可以互换使用，选择哪个纯粹是个人偏好。`it` 读起来更像一个句子，例如 `it('should return true', ...)`。
  - `name` (string): 测试用例的描述。
  - `fn` (function): 包含测试逻辑和断言的代码。
- `expect(value)`: 这是断言的起点，用于创建一个“断言对象”。你接下来会链式调用一个“匹配器”（Matcher）来对 `value` 进行判断。

**示例代码：**

假设我们有一个简单的 `math.js` 文件：

```JavaScript
// src/math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

对应的测试文件 `math.test.js`：

```JavaScript
// src/math.test.js
import { describe, it, expect } from 'vitest';
import { add, subtract } from './math';

// 使用 describe 创建一个名为 'math functions' 的测试套件
describe('math functions', () => {

  // 第一个测试用例：测试 add 函数
  it('should add two numbers correctly', () => {
    // 1. Arrange: 准备测试数据
    const a = 1;
    const b = 2;

    // 2. Act: 调用被测试的函数
    const result = add(a, b);

    // 3. Assert: 使用 expect 和匹配器进行断言
    expect(result).toBe(3);
  });

  // 第二个测试用例：测试 subtract 函数
  it('should subtract two numbers correctly', () => {
    expect(subtract(5, 2)).toBe(3);
  });

  // 嵌套的 describe
  describe('edge cases for add function', () => {
    it('should handle negative numbers', () => {
      expect(add(-1, -1)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });
});
```

------



### 2. 断言与匹配器 (Assertions & Matchers)



`expect` 后面跟着的就是匹配器，Vitest 内置了大量源自 Jest 的匹配器，用于进行各种类型的断言。



#### 常用的匹配器：

- **相等性 (Equality)**

  - `.toBe(value)`: 使用 `Object.is` 进行严格相等比较（类似于 `===`）。主要用于比较原始类型（`string`, `number`, `boolean`, `null`, `undefined`）。
  - `.toEqual(value)`: 深度比较对象或数组的所有属性。用于检查对象和数组是否“结构上”相等。

  ```JavaScript
  it('toBe vs toEqual', () => {
    const user1 = { name: 'Alice' };
    const user2 = { name: 'Alice' };
    // expect(user1).toBe(user2); // 会失败，因为它们是不同的对象引用
    expect(user1).toEqual(user2); // 会成功，因为它们的内容相同
  });
  ```

- **真假值 (Truthiness)**

  - `.toBeTruthy()`: 断言值为“真”（在 if 语句中被认为是 true）。
  - `.toBeFalsy()`: 断言值为“假”（在 if 语句中被认为是 false）。
  - `.toBeNull()`: 断言值为 `null`。
  - `.toBeUndefined()`: 断言值为 `undefined`。
  - `.toBeDefined()`: 断言值不是 `undefined`。
  - `.toBeNaN()`: 断言值为 `NaN`。

- **数字 (Numbers)**

  - `.toBeGreaterThan(number)`: 大于
  - `.toBeGreaterThanOrEqual(number)`: 大于或等于
  - `.toBeLessThan(number)`: 小于
  - `.toBeLessThanOrEqual(number)`: 小于或等于
  - `.toBeCloseTo(number)`: 用于比较浮点数，避免精度问题。

- **字符串 (Strings)**

  - `.toMatch(regexp | string)`: 使用正则表达式或字符串进行匹配。

- **数组和可迭代对象 (Arrays & Iterables)**

  - `.toContain(item)`: 断言数组或可迭代对象中是否包含某个元素。
  - `.toHaveLength(number)`: 断言数组或字符串的长度。

- **对象 (Objects)**

  - `.toHaveProperty(keyPath, [value])`: 断言对象是否含有某个属性，可选地可以检查该属性的值。
  - `.toMatchObject(object)`: 断言一个对象是否匹配另一个对象的子集。

- **异常 (Exceptions)**

  - `.toThrow([error])`: 断言一个函数在调用时是否抛出错误。

  ```JavaScript
  function throwError() {
    throw new Error('Something went wrong');
  }
  it('should throw an error', () => {
    expect(() => throwError()).toThrow('Something went wrong');
  });
  ```

- **`.not` 修饰符**

  - 可以链式调用在任何匹配器之前，表示“非”的逻辑。

  ```JavaScript
  expect(1 + 1).not.toBe(3);
  ```

------



### 3. 生命周期钩子 (Lifecycle Hooks)



有时，你需要在测试运行之前或之后执行一些设置（setup）或清理（teardown）工作。

- `beforeAll(fn)`: 在当前 `describe` 块中所有测试用例开始运行**之前**，执行一次。
- `afterAll(fn)`: 在当前 `describe` 块中所有测试用例运行完毕**之后**，执行一次。
- `beforeEach(fn)`: 在当前 `describe` 块中**每一个**测试用例开始运行之前，都执行一次。
- `afterEach(fn)`: 在当前 `describe` 块中**每一个**测试用例运行完毕之后，都执行一次。

**示例：**

```JavaScript
describe('database tests', () => {
  let db;

  beforeAll(() => {
    // 比如：连接数据库
    console.log('Connecting to the database...');
    // db = connectToDb();
  });

  afterAll(() => {
    // 比如：断开数据库连接
    console.log('Disconnecting from the database...');
    // db.disconnect();
  });

  beforeEach(() => {
    // 比如：在每个测试前清空测试数据
    console.log('Clearing data for a new test...');
    // db.clear();
  });

  it('test case 1', () => {
    expect(true).toBe(true);
  });

  it('test case 2', () => {
    expect(false).toBe(false);
  });
});
```

------



### 4. Mocking（模拟）和 Spying（监视）



单元测试的核心是“隔离”。当你的测试单元依赖于其他模块（如 API 调用、数据库、定时器等）时，你需要模拟（Mock）这些依赖，以确保你的测试是独立和快速的。Vitest 提供了强大的内置 Mocking 功能。

- `vi.fn(implementation?)`: 创建一个 Mock 函数。你可以追踪它的调用情况（被调用了多少次、传入了什么参数等）。
- `vi.spyOn(object, methodName)`: 创建一个 Spy，它“监视”一个对象上已存在的方法。你可以追踪该方法的调用情况，但它默认仍会执行原始实现（除非你修改它）。
- `vi.mock(path, factory?)`: 模拟整个模块。当代码中 `import` 这个模块时，会得到你提供的模拟版本。

**示例1：使用 `vi.fn()`**

```JavaScript
// 测试一个函数是否正确调用了其回调
it('should call the callback function', () => {
  const mockCallback = vi.fn(); // 创建一个 mock 函数
  
  function doSomething(callback) {
    callback('hello');
  }
  
  doSomething(mockCallback);
  
  expect(mockCallback).toHaveBeenCalled(); // 断言被调用过
  expect(mockCallback).toHaveBeenCalledTimes(1); // 断言被调用了1次
  expect(mockCallback).toHaveBeenCalledWith('hello'); // 断言被调用时传入的参数是 'hello'
});
```

**示例2：使用 `vi.spyOn()` 和模拟时间**

```JavaScript
// 模拟 setTimeout
it('should call setTimeout', () => {
  vi.useFakeTimers(); // 启用定时器模拟
  const spy = vi.spyOn(global, 'setTimeout');

  function runAfterTimeout() {
    setTimeout(() => {}, 1000);
  }

  runAfterTimeout();

  vi.advanceTimersByTime(1000); // 快进时间

  expect(spy).toHaveBeenCalledTimes(1);
  vi.useRealTimers(); // 恢复真实定时器
});
```

**示例3：使用 `vi.mock()` 模拟模块**

假设我们有一个 `api.js` 模块：

```JavaScript
// src/api.js
import axios from 'axios';

export async function fetchUser(id) {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
}
```

我们要测试一个使用 `fetchUser` 的函数，但不想真的发送网络请求：

```JavaScript
// src/userService.test.js
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';
import { getUserName } from './userService'; // 假设 userService 调用了 fetchUser

// 告诉 Vitest，当代码

导入 './api' 时，使用我们提供的模拟版本
vi.mock('./api', () => ({
  fetchUser: vi.fn(), // 将 fetchUser 模拟成一个 mock 函数
}));

describe('getUserName', () => {
  it('should return the name of the fetched user', async () => {
    // 设置 mock 函数的返回值
    const mockUser = { id: 1, name: 'John Doe' };
    vi.mocked(fetchUser).mockResolvedValue(mockUser);

    const userName = await getUserName(1);

    expect(fetchUser).toHaveBeenCalledWith(1);
    expect(userName).toBe('John Doe');
  });
});
```

------

还有一个跳过时间的API

**`vi.useFakeTimers()` + `vi.advanceTimersByTime()`**

```js
// debounce.test.js
import { debounce } from './debounce'
import { vi } from 'vitest'

test('calls function after delay', () => {
  vi.useFakeTimers() // 冻结时间

  const mockFn = vi.fn()
  const debounced = debounce(mockFn, 1000)

  debounced('arg1')

  // 此时还没调用
  expect(mockFn).not.toHaveBeenCalled()

  // 快进 1000ms
  vi.advanceTimersByTime(1000)

  expect(mockFn).toHaveBeenCalledWith('arg1')
  expect(mockFn).toHaveBeenCalledTimes(1)

  vi.useRealTimers() // 解冻时间（可选）
})
```



### 5. 其他有用的语法



- `.skip`: 临时跳过某个测试套件或测试用例。
  - `describe.skip(...)`
  - `it.skip(...)`
- `.only`: 只运行某个特定的测试套件或测试用例，方便调试。
  - `describe.only(...)`
  - `it.only(...)`
- `test.concurrent`: 并行运行测试用例，可以提升速度。

以上就是 Vitest 进行单元测试的核心语法。掌握了这些，你就可以开始为你的前端项目编写高质量的单元测试了。建议结合官方文档进行学习，因为库在不断更新，官方文档永远是最新、最准确的信息来源。





## 5.vue组件测试



在 Vue 应用中，主要用组件来构建用户界面。因此，当验证应用的行为时，组件是一个很自然的独立单元。从粒度的角度来看，组件测试位于单元测试之上，可以被认为是集成测试的一种形式。你的 Vue 应用中大部分内容都应该由组件测试来覆盖，我们建议每个 Vue 组件都应有自己的组件测试文件。

组件测试应该捕捉组件中的 prop、事件、提供的插槽、样式、CSS class 名、生命周期钩子，和其他相关的问题。

组件测试不应该模拟子组件，而应该像用户一样，通过与组件互动来测试组件和其子组件之间的交互。例如，组件测试应该像用户那样点击一个元素，而不是编程式地与组件进行交互。

组件测试主要需要关心组件的公开接口而不是内部实现细节。对于大部分的组件来说，公开接口包括触发的事件、prop 和插槽。当进行测试时，请记住，**测试这个组件做了什么，而不是测试它是怎么做到的**。

- **推荐的做法**
  - 对于 **视图** 的测试：根据输入 prop 和插槽断言渲染输出是否正确。
  - 对于 **交互** 的测试：断言渲染的更新是否正确或触发的事件是否正确地响应了用户输入事件。
- **应避免的做法**
  - 不要去断言一个组件实例的私有状态或测试一个组件的私有方法。测试实现细节会使测试代码太脆弱，因为当实现发生变化时，它们更有可能失败并需要更新重写。
  - 组件的最终工作是渲染正确的 DOM 输出，所以专注于 DOM 输出的测试提供了足够的正确性保证(如果你不需要更多其他方面测试的话)，同时更加健壮、需要的改动更少。
  - 不要完全依赖快照测试。断言 HTML 字符串并不能完全说明正确性。应当编写有意图的测试。
    如果一个方法需要测试，把它提取到一个独立的实用函数中，并为它写一个专门的单元测试。如果它不能被直截了当地抽离出来，那么对它的调用应该作为交互测试的一部分。



**推荐方案**

- [Vitest](https://vitest.dev/) 对于组件和组合式函数都采用无头渲染的方式 (例如 VueUse 中的 [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) 函数)。组件和 DOM 都可以通过 [@vue/test-utils](https://github.com/vuejs/test-utils) 来测试。
- [Cypress 组件测试](https://on.cypress.io/component) 会预期其准确地渲染样式或者触发原生 DOM 事件。它可以搭配 [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro) 这个库一同进行测试。

Vitest 和基于浏览器的运行器之间的主要区别是速度和执行上下文。简而言之，基于浏览器的运行器，如 Cypress，可以捕捉到基于 Node 的运行器(如 Vitest) 所不能捕捉的问题(比如样式问题、原生 DOM 事件、Cookies、本地存储和网络故障)，但基于浏览器的运行器比 Vitest *慢几个数量级*，因为它们要执行打开浏览器，编译样式表以及其他步骤。Cypress 是一个基于浏览器的运行器，支持组件测试。请阅读 [Vitest 文档的“比较”这一章](https://vitest.dev/guide/comparisons.html#cypress) 了解 Vitest 和 Cypress 最新的比较信息。



**组件挂载库**

组件测试通常涉及到单独挂载被测试的组件，触发模拟的用户输入事件，并对渲染的 DOM 输出进行断言。有一些专门的工具库可以使这些任务变得更简单。

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) 是官方的底层组件测试库，用来提供给用户访问 Vue 特有的 API。`@testing-library/vue` 也是基于此库构建的。
- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) 是一个专注于测试组件而不依赖于实现细节的 Vue 测试库。它的指导原则是：测试越是类似于软件的使用方式，它们就能提供越多的信心。

我们推荐在应用中使用 `@vue/test-utils` 测试组件。`@testing-library/vue` 在测试带有 Suspense 的异步组件时存在问题，在使用时需要谨慎。





因为@vue/test-utils是vue官方推荐的，所以我们重点放在@vue/test-utils上

好的，我们来详细讲解如何使用 Vitest 结合 `@vue/test-utils` 库对 Vue 3 组件进行单元测试。这是目前 Vue 3 生态中最主流、最高效的组件测试方案。

`@vue/test-utils` 是 Vue 官方提供的组件测试工具库，它提供了一系列方法来挂载组件、模拟用户交互和断言组件状态，而 Vitest 则提供了测试运行器、断言库和 Mocking 工具。两者结合，相得益彰。

------



### 1. 环境准备



首先，确保你的项目中已经安装了必要的依赖：

Bash

```
npm install -D vitest @vue/test-utils jsdom
```

- **vitest**: 测试运行器。
- **@vue/test-utils**: Vue 官方组件测试库。
- **jsdom**: 一个在 Node.js 环境中模拟浏览器环境的库，让你的组件可以在没有真实浏览器的情况下“渲染”。

然后，配置 `vite.config.js` (或 `vitest.config.js`) 来启用 `jsdom` 环境：

JavaScript

```
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    // 启用类似 jest 的全局 API
    globals: true,
    // 使用 jsdom 模拟 DOM 环境
    environment: 'jsdom',
  },
});
```

------



### 2.核心 API 和测试流程



测试一个 Vue 组件通常遵循以下步骤：

1. **挂载 (Mount)**：使用 `@vue/test-utils` 的 `mount` 或 `shallowMount` 方法在内存中创建一个组件实例。
2. **交互 (Interact)**：模拟用户操作，例如点击按钮、输入文本等。
3. **断言 (Assert)**：检查组件的输出（渲染的 HTML）、发出的事件或内部状态是否符合预期。



#### `mount` 和 `shallowMount`



- `mount()`: **深层挂载**。会完整地渲染该组件及其**所有子组件**。适用于需要测试组件与子组件集成的场景。
- `shallowMount()`: **浅层挂载**。只会渲染当前组件，其所有子组件都会被替换为存根（stub）。这可以隔离测试目标，让测试更聚焦于当前组件自身的逻辑，通常是单元测试的首选。

------



### 3. 核心语法和实例讲解



假设我们有一个简单的计数器组件 `Counter.vue`：

代码段

```
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p v-if="isEven" class="even-message">The count is even.</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  initialCount: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(['change']);

const count = ref(props.initialCount);
const isEven = computed(() => count.value % 2 === 0);

const increment = () => {
  count.value++;
  emit('change', count.value);
};
</script>
```

现在，我们为它编写测试文件 `Counter.spec.js`：

JavaScript

```
// src/components/Counter.spec.js
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

describe('Counter.vue', () => {

  // --- 测试 1: 测试初始渲染 ---
  it('renders initial count and message correctly', () => {
    // 1. 挂载组件
    const wrapper = mount(Counter);

    // 2. 断言渲染的文本内容
    // wrapper.text() 会返回组件渲染出的所有文本
    expect(wrapper.text()).toContain('Count: 0');

    // 3. 断言元素是否存在
    // wrapper.find() 用于查找元素，返回一个 Wrapper 对象
    const evenMessage = wrapper.find('.even-message');
    expect(evenMessage.exists()).toBe(true);
    expect(evenMessage.text()).toBe('The count is even.');
  });


  // --- 测试 2: 测试 Props ---
  it('mounts with a specific initialCount prop', () => {
    // 在挂载时通过第二个参数传入 props
    const wrapper = mount(Counter, {
      props: {
        initialCount: 5,
      },
    });

    expect(wrapper.text()).toContain('Count: 5');

    // 初始值为 5 (奇数)，偶数消息不应该存在
    expect(wrapper.find('.even-message').exists()).toBe(false);
  });


  // --- 测试 3: 测试用户交互 (事件) ---
  it('increments the count when the button is clicked', async () => {
    const wrapper = mount(Counter);

    // 查找按钮
    const button = wrapper.find('button');

    // 模拟点击事件
    // 注意：DOM 更新是异步的，所以需要使用 await
    await button.trigger('click');

    // 断言 count 是否更新
    expect(wrapper.text()).toContain('Count: 1');

    // 再次点击
    await button.trigger('click');
    expect(wrapper.text()).toContain('Count: 2');
    expect(wrapper.find('.even-message').exists()).toBe(true);
  });


  // --- 测试 4: 测试 Emitted 事件 ---
  it('emits a "change" event with the new count on increment', async () => {
    const wrapper = mount(Counter);
    
    await wrapper.find('button').trigger('click'); // count is 1
    await wrapper.find('button').trigger('click'); // count is 2

    // wrapper.emitted() 返回一个记录了所有被触发事件的对象
    // { change: [ [1], [2] ] }
    const changeEvents = wrapper.emitted('change');

    // 断言 change 事件被触发了
    expect(changeEvents).toHaveLength(2);

    // 断言第一次触发时 payload 是 [1]
    expect(changeEvents[0]).toEqual([1]);
    
    // 断言第二次触发时 payload 是 [2]
    expect(changeEvents[1]).toEqual([2]);
  });


  // --- 测试 5: 测试组件实例 (vm) ---
  it('accesses component instance data', async () => {
    const wrapper = mount(Counter);

    // 通过 wrapper.vm 访问组件实例
    expect(wrapper.vm.count).toBe(0);

    // 模拟交互
    await wrapper.find('button').trigger('click');

    // 断言实例上的数据已更新
    expect(wrapper.vm.count).toBe(1);
    expect(wrapper.vm.isEven).toBe(false);
  });
});
```

------



### 4. 核心 API 语法详解





#### **`wrapper` 对象**



`mount` 和 `shallowMount` 返回一个 `wrapper` 对象，它是你与组件交互的主要接口。

- **查找元素**
  - `wrapper.find(selector)`: 查找第一个匹配选择器的元素。支持 CSS 选择器、组件定义、`ref`、`name` 等。返回一个新的 `wrapper` 对象。
  - `wrapper.findAll(selector)`: 查找所有匹配的元素。返回一个 `wrapper` 数组。
  - `wrapper.get(selector)`: 和 `find` 类似，但如果找不到元素会直接抛出错误（让测试失败），在确定元素一定存在时使用，可以省去 `.exists()` 的断言。
- **断言元素**
  - `wrapper.exists()`: 返回布尔值，判断元素是否存在。
  - `wrapper.text()`: 返回元素的 `textContent`。
  - `wrapper.html()`: 返回元素的 `innerHTML`。
  - `wrapper.attributes('attrName')`: 获取元素的属性值。
  - `wrapper.classes('className')`: 检查元素是否包含某个 CSS 类。
  - `wrapper.isVisible()`: 检查元素是否可见（没有 `v-show="false"` 或 `display: none`）。
- **模拟交互**
  - `wrapper.trigger(eventName, options?)`: 触发一个 DOM 事件，如 `click`, `input`, `keydown`。**这是最重要的交互方法**。
  - `wrapper.setValue(value)`: 在 `<input>`, `<textarea>`, `<select>` 元素上设置值的快捷方式。
- **处理 Props 和 Emits**
  - `wrapper.setProps({ propName: value })`: 异步更新组件的 props。
  - `wrapper.emitted()`: 获取组件触发的所有事件。
- **访问实例**
  - `wrapper.vm`: 直接访问 Vue 组件的实例。可以用来访问 `data`, `computed`, `methods` 等（对于 `<script setup>`，需要通过 `defineExpose` 暴露出来才能在外部访问）。

------



### 5. 进阶用法：Slots 和 Provide/Inject





#### 测试 Slots (插槽)



你可以在挂载组件时，通过 `slots` 选项提供插槽内容。

**组件 `Modal.vue`:**

代码段

```
<template>
  <div class="modal">
    <header>
      <slot name="header">Default Header</slot>
    </header>
    <main>
      <slot></slot> </main>
  </div>
</template>
```

**测试代码 `Modal.spec.js`:**

JavaScript

```
import { mount } from '@vue/test-utils';
import Modal from './Modal.vue';

it('renders slot content', () => {
  const wrapper = mount(Modal, {
    slots: {
      default: 'Main content here',
      header: '<h1>Custom Header</h1>',
    },
  });

  expect(wrapper.html()).toContain('Main content here');
  expect(wrapper.html()).toContain('<h1>Custom Header</h1>');
});
```



#### 测试 Provide / Inject



使用 `global.provide` 选项来模拟 `provide`。

**组件 `ThemeButton.vue` (使用 inject):**

代码段

```
<template><button :style="{ color: theme.color }">Theme Button</button></template>
<script setup>
import { inject } from 'vue';
const theme = inject('theme');
</script>
```

**测试代码 `ThemeButton.spec.js`:**

JavaScript

```
import { mount } from '@vue/test-utils';
import ThemeButton from './ThemeButton.vue';

it('renders with injected theme', () => {
  const wrapper = mount(ThemeButton, {
    global: {
      provide: {
        // key-value pair for provide/inject
        theme: { color: 'red' },
      },
    },
  });

  expect(wrapper.find('button').attributes('style')).toContain('color: red');
});
```



### 6.@vue/test-utils总结



掌握了以上语法，你就具备了为绝大多数 Vue 3 组件编写单元测试的能力。核心思路始终是：

1. **隔离组件** (`shallowMount` 是你的好朋友)。
2. **设置初始状态** (通过 `props`, `slots`, `provide`)。
3. **模拟用户行为** (`trigger`)。
4. **断言结果** (检查 HTML 输出、`emitted` 事件和组件 `vm` 状态)。
5. **记得 `await`**：所有会引起 DOM 更新的操作几乎都是异步的。





### 7.简单谈谈 @testing-library/vue

常用 API

- `render()`：渲染组件。
- `screen`：查询元素（`getByText`, `getByRole`, `getByTestId`）。
- `fireEvent` / `userEvent`：触发事件。
- `waitFor()`：等待异步操作。



什么是@testing-library/vue

- 它是一个专门为 Vue 设计的测试工具库。
- 基于 `Vue Test Utils` 封装，但更简单、更语义化。
- 遵循 **Testing Library 哲学**：避免测试实现细节（如 `data`、`methods`），而是测试**用户行为和输出**。
- 与 `Vitest` 配合使用，是现代 Vue 3 项目的**推荐测试方案**。

安装

```
npm install -D @testing-library/vue
```



```js
import { test, describe, expect } from 'vitest'
import TodoList from '@/components/TodoList.vue'
import { render, cleanup, fireEvent, screen } from '@testing-library/vue'
import { afterEach } from 'vitest'

describe('TodoList', () => {
  afterEach(() => {
    cleanup()
  })
  test('render', () => {
    const { getByText } = render(TodoList)
    expect(getByText('Add')).toBeInTheDocument()
    expect(getByText('All')).toBeInTheDocument()
    expect(getByText('Active')).toBeInTheDocument()
    expect(getByText('Completed')).toBeInTheDocument()
  })
  test('add todo', async () => {
    const { getByText, getByLabelText, container } = render(TodoList)
    const button = getByText('Add')
    const titleInput = getByLabelText('标题')
    await fireEvent.update(titleInput, '学习vitest')
    const descInput = getByLabelText('描述')
    await fireEvent.update(descInput, '看文档和看视频教程')
    await button.click()
    console.log(container)
    expect(screen.getByText('学习vitest')).toBeInTheDocument()
  })
  test('filter', async () => {
    const { getByText, getByLabelText, getByRole } = render(TodoList)
    const button = getByText('Add')
    const titleInput = getByLabelText('标题')
    await fireEvent.update(titleInput, '学习vitest')
    const descInput = getByLabelText('描述')
    await fireEvent.update(descInput, '看文档和看视频教程')
    await button.click()
    const allButton = getByText('All')
    const activeButton = getByText('Active')
    const completedButton = getByText('Completed')
    await allButton.click()
    expect(screen.getByText('学习vitest')).toBeInTheDocument()
    await activeButton.click()
    expect(screen.getByText('学习vitest')).toBeInTheDocument()
    await completedButton.click()
    expect(screen.queryByText('学习vitest')).toBeNull()
  })
})

```



## 6.组合式函数测试

好的，我们来详细讲解如何使用 Vitest 对 Vue 3 的**组合式函数 (Composable Functions)** 进行单元测试。

测试组合式函数是 Vue 3 测试中的一个重要环节，因为它们封装了项目中最核心、最可复用的业务逻辑。好消息是，由于组合式函数通常是独立的、不直接依赖组件实例的普通 JavaScript 函数，所以测试它们比测试组件要**更简单、更直接**。

------



### 1. 组合式函数测试的核心思想



1. **像调用普通函数一样调用它**：在测试代码中直接导入并执行你的组合式函数。
2. **提供响应式上下文**：如果组合式函数内部使用了 Vue 的响应式 API（如 `watch`, `onMounted` 等），你需要一个方法来模拟 Vue 的响应式环境。
3. **断言返回值**：检查组合式函数返回的 `ref`、`reactive` 对象、`computed` 属性和方法的行为是否符合预期。
4. **触发变化并断言结果**：调用返回的方法，或者改变输入的响应式数据，然后检查函数内部的状态是否正确更新。
5. **隔离外部依赖**：如果组合式函数依赖外部 API（如 `fetch`, `localStorage`），使用 Vitest 的 Mock 功能将其隔离。

------



### 2. 基础示例：测试一个简单的计数器 Composable



假设我们有一个 `useCounter.js`：

JavaScript

```
// composables/useCounter.js
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const double = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, double, increment };
}
```

**测试文件 `useCounter.spec.js`:**

这是一个纯逻辑的 Composable，不依赖任何 Vue 的生命周期钩子或复杂的响应式上下文，所以测试非常直接。

JavaScript

```
// composables/useCounter.spec.js
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value 0', () => {
    // 1. 调用 Composable
    const { count, double } = useCounter();

    // 2. 断言初始状态
    expect(count.value).toBe(0);
    expect(double.value).toBe(0);
  });

  it('should initialize with a given initial value', () => {
    const { count, double } = useCounter(10);

    expect(count.value).toBe(10);
    expect(double.value).toBe(20);
  });

  it('should increment the count when increment() is called', () => {
    const { count, double, increment } = useCounter();

    // 3. 触发动作
    increment();

    // 4. 断言变化后的状态
    expect(count.value).toBe(1);
    expect(double.value).toBe(2);
  });
});
```

**核心语法/要点:**

- 直接导入和调用 `useCounter()`。
- 对于返回的 `ref` 和 `computed`，通过访问它们的 `.value` 属性来获取当前值并进行断言。

------



### 3. 测试依赖响应式输入的 Composable



当 Composable 依赖于传入的响应式参数（例如一个 `ref`），并且内部使用了 `watch` 或 `computed` 来响应其变化时，测试方式稍有不同。

假设我们有一个 `useFilteredList.js`：

JavaScript

```
// composables/useFilteredList.js
import { ref, watch } from 'vue';

export function useFilteredList(list) { // list is expected to be a ref
  const filteredList = ref([]);

  watch(
    list,
    (newList) => {
      filteredList.value = newList.filter(item => item.length > 3);
    },
    { immediate: true } // 立即执行一次
  );

  return { filteredList };
}
```

**测试文件 `useFilteredList.spec.js`:**

JavaScript

```
// composables/useFilteredList.spec.js
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useFilteredList } from './useFilteredList';

describe('useFilteredList', () => {
  it('should filter the list immediately on initialization', () => {
    // 1. 准备响应式输入
    const originalList = ref(['apple', 'pea', 'banana', 'kiwi']);
    
    // 2. 调用 Composable
    const { filteredList } = useFilteredList(originalList);
    
    // 3. 断言初始结果
    expect(filteredList.value).toEqual(['apple', 'banana', 'kiwi']);
  });

  it('should update the filtered list when the original list changes', async () => {
    const originalList = ref(['a', 'b', 'c']);
    const { filteredList } = useFilteredList(originalList);
    
    expect(filteredList.value).toEqual([]); // 初始为空

    // 4. 模拟输入的变更
    originalList.value = ['long', 'short', 'anotherlong'];
    
    // 5. 等待响应式系统更新
    // Vue 的响应式更新是异步的。在测试中，我们需要等待 DOM 更新周期（tick）
    // Vitest (或 Jest) 本身没有 nextTick，但我们可以用一个 resolved promise 来模拟等待
    await new Promise(resolve => setTimeout(resolve, 0)); // 或者使用 vue-test-utils 的 nextTick

    // 6. 断言更新后的结果
    expect(filteredList.value).toEqual(['long', 'anotherlong']);
  });
});
```

**核心语法/要点:**

- 在测试中创建 `ref` 作为输入。
- **关键**：当改变了输入的 `ref` 后，依赖它的 `watch` 或 `computed` 不会同步更新。你需要 `await` 一个微任务（microtask）来等待 Vue 的响应式队列执行完毕。一个简单的 `await Promise.resolve()` 或 `setTimeout` 就可以做到。

------



### 4. 测试依赖生命周期钩子的 Composable



当 Composable 使用 `onMounted`, `onUnmounted` 等生命周期钩子时，你不能简单地在测试文件中调用它，因为此时没有组件实例的上下文。

**解决方案：使用一个“宿主”组件 (Host Component) 来包装 Composable。**

假设我们有一个 `useEventListener.js`：

JavaScript

```
// composables/useEventListener.js
import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target, event, callback) {
  onMounted(() => {
    target.addEventListener(event, callback);
  });
  onUnmounted(() => {
    target.removeEventListener(event, callback);
  });
}
```

**测试文件 `useEventListener.spec.js`:**

JavaScript

```
// composables/useEventListener.spec.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useEventListener } from './useEventListener';

describe('useEventListener', () => {
  it('should add and remove event listener on mount and unmount', async () => {
    const callback = vi.fn(); // 创建一个 mock 函数来追踪调用
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    
    // 1. 创建一个宿主组件来调用我们的 Composable
    const TestComponent = defineComponent({
      template: '<div></div>',
      setup() {
        useEventListener(window, 'click', callback);
        return {};
      },
    });
    
    // 2. 挂载宿主组件
    const wrapper = mount(TestComponent);
    
    // 3. 断言 onMounted 的效果
    expect(addSpy).toHaveBeenCalledWith('click', callback);
    
    // 模拟事件触发
    window.dispatchEvent(new Event('click'));
    expect(callback).toHaveBeenCalledTimes(1);
    
    // 4. 卸载组件
    await wrapper.unmount();
    
    // 5. 断言 onUnmounted 的效果
    expect(removeSpy).toHaveBeenCalledWith('click', callback);
  });
});
```

**核心语法/要点:**

- `defineComponent`: 从 Vue 中导入，用于创建一个临时的测试组件。
- `mount(TestComponent)`: 使用 `@vue/test-utils` 来挂载这个宿主组件，从而触发 Composable 内部的 `onMounted` 钩子。
- `wrapper.unmount()`: 卸载组件，从而触发 `onUnmounted` 钩子。
- `vi.spyOn()` 和 `vi.fn()`: Vitest 的强大工具，用于监视（spy）原生 API（如 `window.addEventListener`）或创建可追踪的模拟函数（mock function）。

------



### 5. 测试异步 Composable (例如数据获取)



假设我们有一个 `useUser.js`，它会获取用户信息。

JavaScript

```
// composables/useUser.js
import { ref } from 'vue';

export function useUser(userId) {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchUser = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/users/${userId.value}`);
      if (!response.ok) throw new Error('Network response was not ok');
      user.value = await response.json();
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 可以在 Composable 被调用时立即获取数据
  // fetchUser();

  return { user, isLoading, error, fetchUser };
}
```

**测试文件 `useUser.spec.js`:**

这里我们需要模拟 `fetch` API。

JavaScript

```
// composables/useUser.spec.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useUser } from './useUser';

// 1. 模拟全局的 fetch 函数
global.fetch = vi.fn();

function createFetchResponse(data) {
  return { json: () => new Promise(resolve => resolve(data)), ok: true };
}

describe('useUser', () => {
  beforeEach(() => {
    // 在每个测试前重置 mock
    global.fetch.mockClear();
  });

  it('should fetch user data and update state correctly', async () => {
    const userId = ref(1);
    const mockUser = { id: 1, name: 'John Doe' };
    
    // 设置 fetch 的模拟返回值
    fetch.mockResolvedValue(createFetchResponse(mockUser));
    
    const { user, isLoading, error, fetchUser } = useUser(userId);
    
    // 初始状态
    expect(user.value).toBe(null);
    expect(isLoading.value).toBe(false);
    
    // 2. 调用异步方法
    const fetchPromise = fetchUser();
    
    // 3. 断言加载中的状态
    expect(isLoading.value).toBe(true);
    
    // 4. 等待异步操作完成
    await fetchPromise;
    
    // 5. 断言成功后的状态
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(isLoading.value).toBe(false);
    expect(user.value).toEqual(mockUser);
    expect(error.value).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const userId = ref(2);
    
    // 模拟一个失败的 fetch 请求
    fetch.mockRejectedValue(new Error('API Error'));

    const { user, isLoading, error, fetchUser } = useUser(userId);

    await fetchUser();

    expect(isLoading.value).toBe(false);
    expect(user.value).toBe(null);
    expect(error.value).toBeInstanceOf(Error);
    expect(error.value.message).toBe('API Error');
  });
});
```

**核心语法/要点:**

- `vi.fn()`: 用于创建一个可以被配置和追踪的 mock 函数。
- `vi.mock()` (未在此例使用，但更常用): 用于模拟整个模块。
- `fetch.mockResolvedValue(...)` / `fetch.mockRejectedValue(...)`: 配置 `fetch` mock 在下次被调用时是成功返回还是失败。
- 测试异步逻辑时，确保你的测试函数是 `async` 的，并使用 `await` 来等待异步操作完成，然后再进行最终的断言。

通过掌握以上几种场景的测试方法，你就可以为项目中各种复杂的组合式函数编写出健壮、可靠的单元测试了。



## 7.VueRouter，pinia测试

好的，我们来详细讲解如何在 Vitest 环境下测试集成了 Vue Router 和 Pinia 这两个 Vue 3 生态核心库的组件。

单元测试的核心原则是**隔离**。当一个组件依赖外部库（如 Router 或 Store）时，我们不希望在测试该组件时启动一个完整的路由系统或一个全局的 Pinia 实例。相反，我们应该**模拟 (Mock)** 这些依赖，以便专注于组件自身的逻辑。

------



### 1. 测试集成了 Pinia 的组件和 Store



测试 Pinia 分为两个层面：

1. **直接测试 Store (Actions, Getters, State)**：这部分是纯粹的 JavaScript 逻辑测试，非常简单。
2. **测试使用了 Store 的组件**：这需要为组件提供一个模拟的或真实的 Store 实例。



#### A. 直接测试 Pinia Store



假设我们有一个 `counter` store：

JavaScript

```
// stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }
  
  async function incrementAsync() {
    await new Promise(resolve => setTimeout(resolve, 10));
    count.value++;
  }

  return { count, doubleCount, increment, incrementAsync };
});
```

**测试文件 `counter.spec.js`:**

JavaScript

```
// stores/counter.spec.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from './counter';

describe('Counter Store', () => {
  // 在每个测试用例运行前，都创建一个新的、干净的 Pinia 实例
  // 这样可以避免测试用例之间的状态污染
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with count 0', () => {
    const store = useCounterStore();
    expect(store.count).toBe(0);
  });

  it('increments the count', () => {
    const store = useCounterStore();
    store.increment();
    expect(store.count).toBe(1);
  });
  
  it('doubles the count', () => {
    const store = useCounterStore();
    store.increment();
    expect(store.doubleCount).toBe(2);
  });
  
  it('increments asynchronously', async () => {
    const store = useCounterStore();
    await store.incrementAsync();
    expect(store.count).toBe(1);
  });
});
```

**核心语法/要点:**

- `createPinia()`: 创建一个 Pinia 实例。
- `setActivePinia()`: 将创建的 Pinia 实例设置为活动的实例，这样 `useStore()` 才能找到它。
- `beforeEach` 钩子：**至关重要**。确保每个 `it` 块都运行在一个独立、纯净的 Pinia 环境中。



#### B. 测试使用了 Store 的组件



假设有一个组件 `CounterComponent.vue`：

代码段

```
<template>
  <div>
    <p>Store Count: {{ store.count }}</p>
    <button @click="store.increment">Increment from Component</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '../stores/counter';
const store = useCounterStore();
</script>
```

**测试文件 `CounterComponent.spec.js`:**

在测试组件时，我们需要在 `mount` 的 `global` 配置中提供一个 Pinia 实例。

JavaScript

```
// components/CounterComponent.spec.js
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CounterComponent from './CounterComponent.vue';
import { useCounterStore } from '../stores/counter';

describe('CounterComponent.vue', () => {
  // 同样，为每个组件测试创建一个新的 Pinia 实例
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  
  it('renders the store count and interacts with the store', async () => {
    // 获取 store 实例，以便在测试中断言
    const store = useCounterStore();
    expect(store.count).toBe(0);

    const wrapper = mount(CounterComponent, {
      global: {
        // 必须通过 plugins 提供 pinia 实例
        plugins: [createPinia()], 
      },
    });

    // 断言初始渲染
    expect(wrapper.text()).toContain('Store Count: 0');
    
    // 模拟点击
    await wrapper.find('button').trigger('click');
    
    // 断言 store 的 state 是否被组件的交互改变了
    expect(store.count).toBe(1);
    
    // 断言组件的视图也更新了
    expect(wrapper.text()).toContain('Store Count: 1');
  });

  it('can be tested with a mocked initial state', () => {
    // 如果你想测试组件在某个特定 store 状态下的表现
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useCounterStore();
    // 直接修改 store 的初始状态
    store.count = 99;

    const wrapper = mount(CounterComponent, {
      global: {
        plugins: [pinia], // 使用我们已经修改过的 pinia 实例
      },
    });

    expect(wrapper.text()).toContain('Store Count: 99');
  });
});
```

**核心语法/要点:**

- `mount(Component, { global: { plugins: [createPinia()] } })`: 这是将 Pinia 实例注入到被测试组件中的标准方式。
- **你可以选择**：
  1. 使用真实的 Store（如上例），测试组件与 Store 的真实集成。
  2. 完全模拟 Store (使用 `vi.mock`)，但这通常更复杂，只在需要深度隔离 Store 逻辑时使用。对于大多数情况，提供一个真实的 Pinia 实例更简单直接。

------



### 2. 测试集成了 Vue Router 的组件



测试依赖 `vue-router` 的组件（例如使用了 `<router-link>` 或 `useRouter()`)，关键在于**创建一个内存中的 mock router**，而不是依赖于项目完整的路由配置。

假设我们有一个 `Header.vue` 组件：

代码段

```
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <button @click="goToLogin">Login</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goToLogin = () => {
  router.push('/login');
};
</script>
```

**测试文件 `Header.spec.js`:**

我们需要使用 `vue-router` 提供的 `createRouter` 和 `createWebHistory` (或 `createMemoryHistory`) 来创建一个临时的路由实例。

JavaScript

```
// components/Header.spec.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Header from './Header.vue';
// 假设有这些组件用于路由渲染
const Home = { template: '<div>Home</div>' };
const About = { template: '<div>About</div>' };

// 1. 定义测试用的路由
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
];

describe('Header.vue', () => {
  it('renders router-links correctly', async () => {
    // 2. 创建一个 router 实例
    const router = createRouter({
      history: createMemoryHistory(), // 使用内存 history，不依赖浏览器 API
      routes,
    });
    
    const wrapper = mount(Header, {
      global: {
        plugins: [router], // 3. 将 router 实例注入组件
      },
    });

    // 查找所有 router-link 组件
    const links = wrapper.findAllComponents({ name: 'RouterLink' });
    
    // 断言链接的目标地址
    expect(links[0].props().to).toBe('/');
    expect(links[1].props().to).toBe('/about');
  });

  it('navigates programmatically on button click', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });
    
    // Spy on router.push to check if it's called
    const pushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(Header, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find('button').trigger('click');

    // 断言 router.push 是否被正确调用
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith('/login');
  });
});
```

**核心语法/要点:**

- `createRouter({ history: createMemoryHistory(), routes })`:
  - `createMemoryHistory()`: **关键**。它创建了一个不依赖于浏览器地址栏的 history 实现，非常适合在 Node.js 测试环境中使用。
  - `routes`: 提供一个最小化的路由配置，仅包含当前测试所需的路由。
- `mount(Component, { global: { plugins: [router] } })`: 与 Pinia 类似，通过 `plugins` 将路由实例注入。
- `wrapper.findAllComponents({ name: 'RouterLink' })`: `@vue/test-utils` 提供了专门查找组件的方法。
- `vi.spyOn(router, 'push')`: Vitest 的 Spy 功能可以用来监视一个方法是否被调用以及以何种参数被调用，非常适合测试程序化导航。



### 3. 同时测试 Pinia 和 Vue Router 的组件



当一个组件同时依赖两者时，只需在 `plugins` 数组中同时提供它们即可。

**组件 `UserProfile.vue`:**

代码段

```
<template>
  <div v-if="user.isLoggedIn">
    <p>Welcome, {{ user.name }}</p>
    <button @click="logoutAndGoHome">Logout</button>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
const user = useUserStore();
const router = useRouter();
const logoutAndGoHome = () => {
  user.logout();
  router.push('/');
};
</script>
```

**测试文件 `UserProfile.spec.js`:**

JavaScript

```
// ... imports
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
// 假设有 user store 和 Home 组件

describe('UserProfile.vue', () => {
  let pinia;
  let router;

  beforeEach(() => {
    // 每次都创建新的实例
    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: 'Home' } }],
    });
  });

  it('logs out and navigates home', async () => {
    // 准备 store 状态
    const userStore = useUserStore();
    userStore.isLoggedIn = true;
    userStore.name = 'Alice';
    
    const pushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(UserProfile, {
      global: {
        // 同时提供 router 和 pinia
        plugins: [router, pinia],
      },
    });

    expect(wrapper.text()).toContain('Welcome, Alice');
    
    await wrapper.find('button').trigger('click');

    // 断言 store action 被调用
    expect(userStore.isLoggedIn).toBe(false); 
    
    // 断言 router push 被调用
    expect(pushSpy).toHaveBeenCalledWith('/');
  });
});
```



### 总结与最佳实践



1. **隔离是关键**：为每个测试用例（或至少每个 `describe`）创建新的、干净的 Pinia 和 Router 实例，避免状态泄露。`beforeEach` 是实现这一点的最佳位置。
2. **使用内存 History**：测试路由时，始终使用 `createMemoryHistory()`。
3. **最小化配置**：在测试中只提供当前测试所需的最小化的 store state 和 routes 配置。
4. **利用 `global.plugins`**: 这是 `@vue/test-utils` 提供的标准、强大的方式，用于注入任何 Vue 插件 (Router, Pinia, i18n 等)。
5. **Spy vs. Mock**：
   - 使用 `vi.spyOn` 来**验证**一个真实的方法（如 `router.push`）是否被调用。
   - 使用 `vi.mock` 来**替换**整个模块的实现，当你需要完全控制一个外部依赖的行为时使用（例如，模拟一个发送 API 请求的模块）。