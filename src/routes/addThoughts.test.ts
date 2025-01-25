import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

vi.mock('$lib/date', () => ({
  date: () => '15/12/2024', // Mock current date
}));

describe('Thoughts functionality', () => {
  let thoughts: Record<string, any> = {};
  let newThought = '';

  const initializeStorage = () => {
    if (!localStorage.getItem('thoughts')) {
      localStorage.setItem('thoughts', '{}');
    }
    loadThoughts();
  };

  const loadThoughts = () => {
    try {
      const storedThoughts = localStorage.getItem('thoughts');
      thoughts = storedThoughts ? JSON.parse(storedThoughts) : {};
    } catch {
      thoughts = {};
    }
  };

  const saveThoughts = () => {
    localStorage.setItem('thoughts', JSON.stringify(thoughts));
  };

  const addThought = () => {
    if (!newThought.trim()) return;
    thoughts[newThought] = { count: 0, records: {} };
    saveThoughts();
    newThought = '';
  };

  const increment = (key: string) => {
    const currentDate = '15/12/2024';
    const record = thoughts[key].records[currentDate] || { record: [], count: 0 };

    record.count += 1;
    record.record.push(new Date().toISOString());
    thoughts[key].records[currentDate] = record;
    thoughts[key].count += 1;

    saveThoughts();
  };

  const decrement = (key: string) => {
    if (thoughts[key].count <= 0) return;

    const currentDate = '15/12/2024';
    const record = thoughts[key].records[currentDate];

    if (record) {
      record.count = Math.max(0, record.count - 1);
      record.record.pop();
    }
    thoughts[key].count = Math.max(0, thoughts[key].count - 1);

    saveThoughts();
  };

  const reset = () => {
    for (const key in thoughts) {
      if (Object.prototype.hasOwnProperty.call(thoughts, key)) {
        thoughts[key].count = 0;
      }
    }
    saveThoughts();
  };

  beforeEach(() => {
    localStorage.clear();
    thoughts = {};
    newThought = '';
  });

  it('should initialize storage', () => {
    initializeStorage();
    expect(localStorage.getItem('thoughts')).toBe('{}');
  });

  it('should load thoughts from localStorage', () => {
    localStorage.setItem('thoughts', JSON.stringify({ test: { count: 1, records: {} } }));
    loadThoughts();
    expect(thoughts).toEqual({ test: { count: 1, records: {} } });
  });

  it('should save thoughts to localStorage', () => {
    thoughts = { test: { count: 1, records: {} } };
    saveThoughts();
    expect(localStorage.getItem('thoughts')).toBe(JSON.stringify({ test: { count: 1, records: {} } }));
  });

  it('should add a new thought', () => {
    newThought = 'test';
    addThought();
    expect(thoughts).toHaveProperty('test');
    expect(thoughts['test'].count).toBe(0);
  });

  it('should increment thought count', () => {
    thoughts = { test: { count: 0, records: {} } };
    increment('test');
    expect(thoughts['test'].count).toBe(1);
    expect(thoughts['test'].records['15/12/2024'].count).toBe(1);
  });

  it('should decrement thought count', () => {
    thoughts = { test: { count: 2, records: { '15/12/2024': { count: 2, record: ['date1', 'date2'] } } } };
    decrement('test');
    expect(thoughts['test'].count).toBe(1);
    expect(thoughts['test'].records['15/12/2024'].count).toBe(1);
  });

  it('should reset all thoughts', () => {
    thoughts = { test: { count: 2, records: {} }, another: { count: 5, records: {} } };
    reset();
    expect(thoughts['test'].count).toBe(0);
    expect(thoughts['another'].count).toBe(0);
  });
});
