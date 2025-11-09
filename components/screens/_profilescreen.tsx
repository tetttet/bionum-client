import React from "react";
import { ScrollView, View } from "react-native";
import ProfileCard from "../cards/ProfileCard";
import ProfileChangeCard from "../cards/ProfileChangeCard";
import ProfileLangChangeCard from "../cards/ProfileLangChangeCard";

const ProfileScreenDemo = () => {
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 70 }}>
        <View style={{ marginHorizontal: 18 }}>
          <ProfileCard
            firstName="John"
            middleName="Michael"
            lastName="Doe"
            email="john.doe@example.com"
            dateOfBirth="1990-01-01"
          />
          <ProfileChangeCard />
          <ProfileLangChangeCard />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreenDemo;
