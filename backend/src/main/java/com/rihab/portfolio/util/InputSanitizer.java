package com.rihab.portfolio.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Normalises user-provided text before it is stored. The frontend (React) escapes output anyway;
 * this is defence in depth: HTML tags and control characters are removed and whitespace trimmed.
 */
public final class InputSanitizer {

    private static final Pattern HTML_TAGS = Pattern.compile("<[^>]*>");
    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\p{Cntrl}&&[^\\n\\t]]");
    private static final Pattern SINGLE_LINE_WS = Pattern.compile("\\s+");
    private static final Pattern EXCESS_BLANK_LINES = Pattern.compile("\\n{3,}");

    private InputSanitizer() {
    }

    /** For single-line fields (name, subject): strips tags/control chars and collapses whitespace. */
    public static String singleLine(String input) {
        if (input == null) {
            return null;
        }
        String cleaned = HTML_TAGS.matcher(input).replaceAll("");
        cleaned = CONTROL_CHARS.matcher(cleaned).replaceAll("");
        return SINGLE_LINE_WS.matcher(cleaned).replaceAll(" ").trim();
    }

    /** For multi-line fields (message): keeps line breaks but strips tags/control chars. */
    public static String multiLine(String input) {
        if (input == null) {
            return null;
        }
        String cleaned = input.replace("\r\n", "\n").replace('\r', '\n');
        cleaned = HTML_TAGS.matcher(cleaned).replaceAll("");
        cleaned = CONTROL_CHARS.matcher(cleaned).replaceAll("");
        cleaned = EXCESS_BLANK_LINES.matcher(cleaned).replaceAll("\n\n");
        return cleaned.trim();
    }

    /** Trims each entry and drops blanks. Null becomes an empty list. */
    public static List<String> cleanList(List<String> input) {
        List<String> result = new ArrayList<>();
        if (input == null) {
            return result;
        }
        for (String value : input) {
            if (value != null && !value.isBlank()) {
                result.add(value.trim());
            }
        }
        return result;
    }

    /** Trims and converts blank strings to null. */
    public static String blankToNull(String input) {
        if (input == null) {
            return null;
        }
        String trimmed = input.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
