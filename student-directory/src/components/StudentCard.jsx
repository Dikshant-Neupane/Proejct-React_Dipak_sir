import Badge from './Badge';
import Button from './Button';
import './StudentCard.css';

export default function StudentCard({ student, onDelete, onTogglePresence }) {
  const { id, name, course, grade, isPresent } = student;

  return (
    <div className="student-card">
      <div className="student-card__header">
        <h3 className="student-card__name">{name}</h3>
        <div className="student-card__badges">
          <Badge type={isPresent ? 'success' : 'neutral'}>
            {isPresent ? 'Present' : 'Absent'}
          </Badge>
          {grade >= 90 && <Badge type="warning">Top Performer</Badge>}
        </div>
      </div>
      <div className="student-card__body">
        <p className="student-card__course">{course}</p>
        <p className="student-card__grade">
          Grade: <strong>{grade}</strong>
        </p>
      </div>
      <div className="student-card__actions">
        <Button 
          variant="outline" 
          onClick={() => onTogglePresence(id)}
          aria-label={`Mark ${name} as ${isPresent ? 'absent' : 'present'}`}
        >
          Mark {isPresent ? 'Absent' : 'Present'}
        </Button>
        <Button 
          variant="danger" 
          onClick={() => onDelete(id)}
          aria-label={`Remove ${name} from directory`}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
