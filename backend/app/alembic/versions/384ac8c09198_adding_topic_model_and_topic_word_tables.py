"""adding topic model and topic word tables

Revision ID: 384ac8c09198
Revises: c73cf9ddb1a6
Create Date: 2021-12-22 14:00:32.923076

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '384ac8c09198'
down_revision = 'c73cf9ddb1a6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('topicmodel',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('model_name', sa.String(), nullable=False),
    sa.Column('x', sa.Integer(), nullable=False),
    sa.Column('y', sa.Integer(), nullable=False),
    sa.Column('label', sa.String(), nullable=False),
    sa.Column('size', sa.Integer(), nullable=False),
    sa.Column('fk_project', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['fk_project'], ['project.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_topicmodel_id'), 'topicmodel', ['id'], unique=False)
    op.create_table('topicword',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('word', sa.String(), nullable=False),
    sa.Column('frequency', sa.Float(), nullable=False),
    sa.Column('fk_topic_model', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['fk_topic_model'], ['topicmodel.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_topicword_id'), 'topicword', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_topicword_id'), table_name='topicword')
    op.drop_table('topicword')
    op.drop_index(op.f('ix_topicmodel_id'), table_name='topicmodel')
    op.drop_table('topicmodel')
    # ### end Alembic commands ###