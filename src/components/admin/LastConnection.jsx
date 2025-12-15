import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function LastConnection({ lastConnectionDate }) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      if (!lastConnectionDate) {
        setTimeAgo('Jamais connecté');
        return;
      }

      try {
        const date = new Date(lastConnectionDate);
        const distance = formatDistanceToNow(date, { 
          addSuffix: true, 
          locale: fr 
        });
        setTimeAgo(distance);
      } catch (error) {
        setTimeAgo('Date invalide');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update chaque minute

    return () => clearInterval(interval);
  }, [lastConnectionDate]);

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Clock size={18} className="text-emerald-600" />
      <span className="text-sm">{timeAgo}</span>
    </div>
  );
}
