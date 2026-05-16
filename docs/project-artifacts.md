# Project Artifacts

This repository is organized as a public product prototype for EDAVT. The materials are designed to help educators, technical reviewers, collaborators, and open-source contributors understand the current prototype, its intended workflows, and its implementation direction.

## Artifact Guide

| Artifact | What it shows | Why it matters |
| --- | --- | --- |
| Working static prototype | EDAVT has progressed beyond an abstract concept into a navigable interface. | Reviewers can inspect the current product direction directly. |
| Synthetic data model | Core workflows can be demonstrated without using student records. | Product demos can remain privacy-preserving while the design is evaluated. |
| Role-scoped views | The system accounts for different education stakeholders and access limits. | Administrators, counselors, teachers, and researchers can see role-appropriate workflows. |
| Early-warning and SHAP-style panels | EDAVT is designed around explainable intervention workflows, not only dashboards. | Users can inspect why a student or cohort is being flagged before taking action. |
| Connector examples | The data layer is standards-oriented and designed for interoperability. | The architecture can align with district systems instead of requiring one-off imports. |
| Audit and privacy views | Privacy, access logging, consent, and data handling are treated as product requirements. | Districts need transparency, accountability, and review trails for analytics tools. |
| Documentation | Architecture, deployment, competitive positioning, citations, and roadmap are explicit. | Contributors can understand the project direction without reverse-engineering the prototype. |

## Repository Boundaries

The public repository intentionally excludes:

- real student records;
- private district materials;
- credentials, API keys, secrets, or production logs;
- private data-sharing agreements;
- Word temporary lock files and local system files;
- any real student, district, university, employer, or government data.
