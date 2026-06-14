import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { LibraryType } from '../utils';

@Entity('library')
@Index('IDX_library_workspaceId_type', ['workspaceId', 'type'])
export class Library {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'enum', enum: LibraryType, enumName: 'library_type_enum' })
  type: LibraryType;

  @Column({ type: 'text' })
  fileUrl: string;

  @Index()
  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @Index()
  @Column({ type: 'text' })
  createdById: string;

  @Column({ type: 'text', nullable: true })
  updatedById: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
