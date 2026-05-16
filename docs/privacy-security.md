# Privacy and Security Design

EDAVT is designed for a regulated education environment. The current repository is only a prototype, but it documents the intended privacy and security posture.

## Privacy Principles

- Collect only the data required for defined student-support workflows.
- Keep student identifiers pseudonymized in analytics views wherever practical.
- Use role-based and attribute-based access rules.
- Log access to sensitive records.
- Use aggregation thresholds for cohort reporting.
- Provide consent, opt-out, correction, and disclosure workflow patterns.

## Security Design Targets

- encryption in transit;
- encryption at rest;
- identity provider integration;
- MFA for administrative roles;
- least-privilege access;
- audit logging;
- vulnerability scanning in CI;
- independent security testing before production pilots;
- SOC 2 readiness work before commercial deployment.

## Prototype Limitation

The current UI simulates these controls. It does not represent a live production environment, an audited compliance certification, or operational processing of real student records.

