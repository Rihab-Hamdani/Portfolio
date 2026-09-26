package com.rihab.portfolio.service;

import com.rihab.portfolio.util.InputSanitizer;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

class InputSanitizerTest {

    @Test
    void singleLineStripsTagsControlCharsAndCollapsesWhitespace() {
        assertThat(InputSanitizer.singleLine("  <i>Hello</i>\u0007   world\n ")).isEqualTo("Hello world");
    }

    @Test
    void multiLineKeepsParagraphsButLimitsBlankLines() {
        assertThat(InputSanitizer.multiLine("Line 1\r\n\r\n\r\n\r\nLine 2<br/>")).isEqualTo("Line 1\n\nLine 2");
    }

    @Test
    void cleanListDropsBlanksAndNulls() {
        assertThat(InputSanitizer.cleanList(Arrays.asList(" a ", "", null, "b"))).containsExactly("a", "b");
        assertThat(InputSanitizer.cleanList(null)).isEmpty();
    }

    @Test
    void blankToNull() {
        assertThat(InputSanitizer.blankToNull("   ")).isNull();
        assertThat(InputSanitizer.blankToNull(" x ")).isEqualTo("x");
    }
}
