import pytest
from modules.security.rbac import rbac_engine

@pytest.mark.security
def test_rbac_super_admin():
    # SUPER_ADMIN should have access to literally anything
    assert rbac_engine.has_permission("SUPER_ADMIN", "delete:universe") is True

@pytest.mark.security
def test_rbac_standard_user():
    # USER should have read own profile
    assert rbac_engine.has_permission("USER", "read:own_profile") is True
    # USER should NOT have read all
    assert rbac_engine.has_permission("USER", "read:all") is False

@pytest.mark.security
def test_rbac_admin_write_all():
    # ADMIN has "write:all" which grants cascading access
    assert rbac_engine.has_permission("ADMIN", "write:settings") is True
