package com.rihab.portfolio.entity;

/**
 * A project screenshot stored inside the projects.screenshots JSONB column.
 *
 * @param src     image URL or path (e.g. /projects/medical-cabinet/dashboard.webp)
 * @param caption short caption displayed under the image
 * @param alt     accessible description of the image
 */
public record Screenshot(String src, String caption, String alt) {
}
