import React, { useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import tw from "twrnc";
import CommentaireForms from "../components/comForms";
import CommentaireList from "../components/comList";

export interface CommentaireScreenProps {
  ligneId: number;
  onCommentAdded?:()=>void;
}

export default function CommentaireScreen({ ligneId,onCommentAdded }: CommentaireScreenProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCommentSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    onCommentAdded?.();
  };

  return (
    <KeyboardAvoidingView 
      style={tw`flex-1 bg-[#F0F2F5]`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-2 pb-8`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CommentaireForms 
          ligneId={ligneId} 
          onSuccess={handleCommentSuccess}
        />
        <CommentaireList 
          ligneId={ligneId} 
          refreshTrigger={refreshTrigger}
          onCommentDeleted={handleCommentSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
