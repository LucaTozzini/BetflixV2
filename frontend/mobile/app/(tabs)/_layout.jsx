import { Tabs } from "expo-router";
import TabBar from "../../components/tabBar";

export default () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    />
  );
};
