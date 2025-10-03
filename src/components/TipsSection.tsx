import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function TipsSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Советы по уходу</h2>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Droplets" size={24} className="text-primary" />
              Полив
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Регулярность полива зависит от вида растения. Большинство комнатных растений 
              предпочитают умеренный полив 1-2 раза в неделю. Перед поливом проверяйте почву.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sun" size={24} className="text-primary" />
              Освещение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Большинство растений любят яркий рассеянный свет. Избегайте прямых солнечных лучей, 
              которые могут обжечь листья.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Thermometer" size={24} className="text-primary" />
              Температура
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Оптимальная температура для большинства комнатных растений — 18-24°C. 
              Избегайте резких перепадов температуры и сквозняков.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
