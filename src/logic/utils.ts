/*                                      Util Namespaces */

namespace MathUtil {
  export function getRandomIntBelow(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * A generator to find all the combinations of an array by specifying combination length
   */
  export function* generateCombinations<T>(
    array: T[],
    length: number,
    solution: T[] = []
  ) {
    if (length <= 0) {
      yield array;
    } else {
      for (let i = 0; i < array.length; i++) {
        yield* generateCombinations<T>(
          array.filter((_, j) => i != j),
          length - 1,
          [...solution, array[i]]
        );
      }
    }
  }
  /**
   * Shuffle array in-place
   */
  export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }

    return array;
  }
}
namespace StringUtil {
  export function padRightUntilLength(
    str: string,
    length: number,
    char: string
  ): string {
    while (str.length < length) {
      str = char + str;
    }
    return str;
  }
}
