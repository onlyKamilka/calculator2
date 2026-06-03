const { calculate, formatNumber } = require("./script");

describe("Калькулятор - модульные тесты", () => {
  // ========== ТЕСТЫ СЛОЖЕНИЯ ==========
  describe("Сложение (add)", () => {
    test("2 + 3 = 5", () => {
      expect(calculate("2", "add", "3")).toBe(5);
    });

    test("0 + 5 = 5", () => {
      expect(calculate("0", "add", "5")).toBe(5);
    });

    test("-2 + 3 = 1", () => {
      expect(calculate("-2", "add", "3")).toBe(1);
    });

    test("0.1 + 0.2 = 0.3", () => {
      expect(calculate("0.1", "add", "0.2")).toBeCloseTo(0.3);
    });
  });

  // ========== ТЕСТЫ ВЫЧИТАНИЯ ==========
  describe("Вычитание (subtract)", () => {
    test("10 - 4 = 6", () => {
      expect(calculate("10", "subtract", "4")).toBe(6);
    });

    test("5 - 10 = -5", () => {
      expect(calculate("5", "subtract", "10")).toBe(-5);
    });

    test("0 - 5 = -5", () => {
      expect(calculate("0", "subtract", "5")).toBe(-5);
    });
  });

  // ========== ТЕСТЫ УМНОЖЕНИЯ ==========
  describe("Умножение (multiply)", () => {
    test("6 × 7 = 42", () => {
      expect(calculate("6", "multiply", "7")).toBe(42);
    });

    test("5 × 0 = 0", () => {
      expect(calculate("5", "multiply", "0")).toBe(0);
    });

    test("-4 × 3 = -12", () => {
      expect(calculate("-4", "multiply", "3")).toBe(-12);
    });
  });

  // ========== ТЕСТЫ ДЕЛЕНИЯ ==========
  describe("Деление (divide)", () => {
    test("15 ÷ 3 = 5", () => {
      expect(calculate("15", "divide", "3")).toBe(5);
    });

    test("10 ÷ 2 = 5", () => {
      expect(calculate("10", "divide", "2")).toBe(5);
    });

    test("7 ÷ 2 = 3.5", () => {
      expect(calculate("7", "divide", "2")).toBe(3.5);
    });

    test("Деление на ноль = NaN", () => {
      expect(calculate("10", "divide", "0")).toBeNaN();
    });
  });

  // ========== ТЕСТЫ ФОРМАТИРОВАНИЯ ==========
  describe("Форматирование чисел (formatNumber)", () => {
    test("Короткое число не меняется", () => {
      expect(formatNumber(123)).toBe("123");
    });

    test("Длинное число становится экспоненциальным", () => {
      expect(formatNumber(1234567890123)).toMatch(/e\+/);
    });

    test("Null превращается в 0", () => {
      expect(formatNumber(null)).toBe("0");
    });

    test("Undefined превращается в 0", () => {
      expect(formatNumber(undefined)).toBe("0");
    });

    test("NaN превращается в 0", () => {
      expect(formatNumber(NaN)).toBe("0");
    });
  });

  // ========== КРАЕВЫЕ СЛУЧАИ ==========
  describe("Краевые случаи", () => {
    test("Пустые строки обрабатываются как 0", () => {
      expect(calculate("", "add", "")).toBe(0);
    });

    test("Некорректные операторы возвращают второй аргумент", () => {
      expect(calculate("5", "unknown", "3")).toBe(3);
    });

    test("Большие числа не ломают калькулятор", () => {
      const result = calculate("9999999999", "add", "1");
      expect(result).toBe(10000000000);
    });
  });
});

// ========== АСИНХРОННЫЕ ТЕСТЫ (опционально) ==========
describe("Дополнительные тесты", () => {
  test("Цепочка операций через calculate", () => {
    let result = calculate("5", "add", "3");
    result = calculate(result.toString(), "multiply", "2");
    expect(result).toBe(16);
  });

  test("Проверка на отрицательный результат", () => {
    expect(calculate("3", "subtract", "10")).toBe(-7);
  });
});

// ========== ВЫВОД РЕЗУЛЬТАТОВ ТЕСТИРОВАНИЯ ==========
console.log("\n═══════════════════════════════════════════════════");
console.log("🧪 Модульные тесты калькулятора загружены");
console.log("📋 Всего тестов: 21");
console.log("═══════════════════════════════════════════════════\n");
