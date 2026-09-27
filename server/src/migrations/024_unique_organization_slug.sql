ALTER TABLE organization
ADD CONSTRAINT unique_organization_slug
    UNIQUE (slug);