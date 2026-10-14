import { describe, expect, it } from 'vitest';
import { bcsQuestions, computeScore, makeDeck, grade, NEGATIVE_MARK } from '@/lib/bcs-questions';

describe('BCS scoring', () => {
  it('deducts 0.5 per wrong answer with negative marking', () => {
    expect(NEGATIVE_MARK).toBe(0.5);
    expect(computeScore(10, 4, true)).toBe(8);
  });
  it('does not deduct without negative marking', () => {
    expect(computeScore(10, 4, false)).toBe(10);
  });
  it('grades correct, wrong and skipped answers', () => {
    const q = bcsQuestions[0]!;
    expect(grade(q, q.answer).status).toBe('correct');
    expect(grade(q, (q.answer + 1) % 4).status).toBe('wrong');
    expect(grade(q, null).status).toBe('skipped');
  });
});

describe('BCS question deck', () => {
  it('never repeats a question until the whole pool is used', () => {
    const next = makeDeck(null);
    const seen = new Set(Array.from({ length: bcsQuestions.length }, () => next().q));
    expect(seen.size).toBe(new Set(bcsQuestions.map(q => q.q)).size);
  });
  it('keeps subject decks within the chosen subject without repeats', () => {
    const subject = bcsQuestions[0]!.subject;
    const pool = bcsQuestions.filter(q => q.subject === subject);
    const next = makeDeck(subject);
    const drawn = Array.from({ length: pool.length }, () => next());
    expect(drawn.every(q => q.subject === subject)).toBe(true);
    expect(new Set(drawn.map(q => q.q)).size).toBe(pool.length);
  });
  it('every question has an explanation', () => {
    expect(bcsQuestions.filter(q => !q.explain?.trim())).toEqual([]);
  });
});
