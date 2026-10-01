"""Initial auth tables

Revision ID: f8d4a6f3ef02
Revises: 
Create Date: 2026-10-01 22:46:33.203000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f8d4a6f3ef02'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Users Table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('fullName', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('passwordHash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('verificationStatus', sa.String(length=50), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('failedLoginAttempts', sa.Integer(), nullable=True),
        sa.Column('lockoutUntil', sa.DateTime(timezone=True), nullable=True),
        sa.Column('isDeleted', sa.Boolean(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updatedAt', sa.DateTime(timezone=True), nullable=True),
        sa.Column('authProvider', sa.String(length=50), nullable=True),
    )
    op.create_index('ix_users_phone', 'users', ['phone'], unique=True)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # 2. User Sessions Table
    op.create_table(
        'user_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('userId', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('deviceName', sa.String(length=100), nullable=False),
        sa.Column('os', sa.String(length=100), nullable=False),
        sa.Column('browser', sa.String(length=100), nullable=False),
        sa.Column('ipAddress', sa.String(length=50), nullable=False),
        sa.Column('loginTime', sa.DateTime(timezone=True), nullable=True),
        sa.Column('lastActivity', sa.DateTime(timezone=True), nullable=True),
        sa.Column('expiresAt', sa.DateTime(timezone=True), nullable=False),
        sa.Column('isActive', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    )
    op.create_index('ix_user_sessions_userId', 'user_sessions', ['userId'], unique=False)

    # 3. OTP Codes Table
    op.create_table(
        'otp_codes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('identifier', sa.String(length=255), nullable=False),
        sa.Column('otpHash', sa.String(length=255), nullable=False),
        sa.Column('expiresAt', sa.DateTime(timezone=True), nullable=False),
        sa.Column('attempts', sa.Integer(), nullable=True),
        sa.Column('isActive', sa.Boolean(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_otp_codes_identifier', 'otp_codes', ['identifier'], unique=False)

    # 4. Refresh Tokens Table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('sessionId', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('userId', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tokenHash', sa.String(length=255), nullable=False),
        sa.Column('expiresAt', sa.DateTime(timezone=True), nullable=False),
        sa.Column('isRevoked', sa.Boolean(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['sessionId'], ['user_sessions.id'], ),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    )
    op.create_index('ix_refresh_tokens_sessionId', 'refresh_tokens', ['sessionId'], unique=False)

    # 5. Login History Table
    op.create_table(
        'login_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('identifier', sa.String(length=255), nullable=False),
        sa.Column('eventType', sa.String(length=50), nullable=False),
        sa.Column('ipAddress', sa.String(length=50), nullable=False),
        sa.Column('device', sa.String(length=100), nullable=False),
        sa.Column('os', sa.String(length=100), nullable=False),
        sa.Column('browser', sa.String(length=100), nullable=False),
        sa.Column('success', sa.Boolean(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_login_history_identifier', 'login_history', ['identifier'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_login_history_identifier', table_name='login_history')
    op.drop_table('login_history')
    
    op.drop_index('ix_refresh_tokens_sessionId', table_name='refresh_tokens')
    op.drop_table('refresh_tokens')
    
    op.drop_index('ix_otp_codes_identifier', table_name='otp_codes')
    op.drop_table('otp_codes')
    
    op.drop_index('ix_user_sessions_userId', table_name='user_sessions')
    op.drop_table('user_sessions')
    
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_phone', table_name='users')
    op.drop_table('users')
