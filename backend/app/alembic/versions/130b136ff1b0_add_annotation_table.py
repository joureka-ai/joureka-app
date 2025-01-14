"""add annotation table

Revision ID: 130b136ff1b0
Revises: 3961bb002586
Create Date: 2021-10-22 07:51:00.718178

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '130b136ff1b0'
down_revision = '3961bb002586'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('annot',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('external_id', sa.String(), nullable=True),
    sa.Column('label', sa.String(), nullable=True),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('start_time', sa.Interval(), nullable=True),
    sa.Column('end_time', sa.Interval(), nullable=True),
    sa.Column('fk_document', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['fk_document'], ['document.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('external_id')
    )
    op.create_index(op.f('ix_annot_id'), 'annot', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_annot_id'), table_name='annot')
    op.drop_table('annot')
    # ### end Alembic commands ###
