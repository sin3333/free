import { View } from "react-native";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
/* カレンダーUIのライブラリ https://github.com/wix/react-native-calendars
'react-native-calendars'が使えない場合、"git pull" の後に　"expo install" を実行 */

function calendar() {
  <View>
    <Calendar
      onDayPress={day => {
        console.log('selected day', day);
      }}
    />
  </View>
}

export default function test2Screen() {
  return (
    <View>
      <Calendar />
    </View>
  )
}