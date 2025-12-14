# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **ZIP Batch Upload** - Upload images in bulk via ZIP archive
  - Browser-side extraction using JSZip
  - Batch processing (50 images per batch) to prevent memory overflow
  - Real-time extraction and upload progress display
  - Unified tag setting for all images
  - Auto-skip non-image files and files over 70MB

### Fixed

- Fix deleted images not disappearing from Upload/Manage pages without a hard refresh (TanStack Query cache + recent uploads list).
