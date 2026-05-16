# Architecture Summary

EDAVT is designed as a cloud-agnostic education analytics platform that ingests data from common school systems, transforms it into privacy-preserving analytical features, and presents role-scoped insights to educators and administrators.

## Layer 1: Data Integration

The proposed integration layer prioritizes established education standards:

- **Ed-Fi** for operational data store and API integration.
- **1EdTech OneRoster** for roster, course, class, enrollment, and gradebook exchange.
- **LTI 1.3 Advantage** for embedding dashboards into learning-management environments.
- **xAPI** for granular learning-activity statements.
- **QTI** for assessment data.
- **CSV/SFTP adapters** for districts that lack modern API coverage.

## Layer 2: Analytics and Machine Learning

The analytics layer is designed to support:

- at-risk student classification;
- longitudinal outcome forecasting;
- cohort segmentation and outlier detection;
- SHAP-style model explanations;
- model versioning and drift monitoring;
- evaluation on synthetic, public, or pilot-approved datasets only.

## Layer 3: User Experience

The prototype demonstrates seven views:

- district overview;
- at-risk students;
- predictions;
- student segments;
- data sources;
- audit log;
- privacy and compliance.

Each view is role-scoped to show how a district superintendent, principal, counselor, teacher, or researcher would see different data boundaries.

## Layer 4: Privacy and Governance

The design treats privacy and governance as core architecture:

- role-based access control;
- pseudonymized identifiers;
- audit logging;
- consent and opt-out workflows;
- k-anonymity thresholds for cohort reporting;
- encryption design targets;
- pre-production security review and SOC 2 readiness roadmap.

