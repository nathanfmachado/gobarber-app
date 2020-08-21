import React, { useCallback, useRef } from 'react';
import { Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container, Title,
  ForgotPassword, ForgotPasswordText,
  CreateAccountButton, CreateAccountButtonText
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const nav = useNavigation();

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      //await SignIn({
      //  email: data.email,
      //  password: data.password,
      //});

      //history.push('/dashboard');
    } catch(err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro na Autenticação',
        'Ocorreu um erro ao fazer login, cheque suas credenciais',
      );
    }
  }, []);
  
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu login</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn} style={{width: '100%'}}>
              <Input name="email" icon="mail"
                placeholder="E-mail" autoCorrect={false}
                autoCapitalize="none" keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {passwordInputRef.current?.focus()}}
              />
              <Input ref={passwordInputRef} name="password"
                icon="lock" placeholder="Senha"
                returnKeyType="send" secureTextEntry
                onSubmitEditing={() => {formRef.current?.submitForm()}}
              />

              <Button onPress={() => {formRef.current?.submitForm()}}>
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => nav.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>

    </>
  );
};

export default SignIn;