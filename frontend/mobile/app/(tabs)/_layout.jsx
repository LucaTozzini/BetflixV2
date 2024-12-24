import { Tabs } from "expo-router/tabs";
import TabBar from "../../components/tabBar";

export default () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    />
  );
};
