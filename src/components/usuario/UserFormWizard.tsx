import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  UsuarioEstado,
  UsuarioResponse,
} from '../../types/usuario';
import { rolesService } from '../../services/rolServices';
import { usuarioService } from '../../services/usuarioServices';
import type { RolResponse } from '../../types/roles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
  userToEdit?: UsuarioResponse | null;
};

type FormStep1 = {
  nombreCompleto: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  dui: string;
  fechaNacimiento: string; // YYYY-MM-DD
  estado: UsuarioEstado;
};

export default function UserFormWizard({ visible, onClose, onCreated, userToEdit }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Paso 2: roles
  const [askAssignRole, setAskAssignRole] = useState<boolean>(true);
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [rolesSelected, setRolesSelected] = useState<number[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormStep1>({
    defaultValues: {
      nombreCompleto: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      dui: '',
      fechaNacimiento: '',
      estado: 'ACTIVO',
    },
  });

  // Cargar roles y precargar datos cuando se abre el modal
  useEffect(() => {
    if (!visible) return;

    setStep(1);
    setAskAssignRole(true);
    setRolesSelected([]);

    // Precarga si se está editando
    if (userToEdit) {
      reset({
        nombreCompleto: userToEdit.nombreCompleto || '',
        email: userToEdit.email || '',
        password: '', // nunca se rellena
        telefono: userToEdit.telefono || '',
        direccion: userToEdit.direccion || '',
        dui: userToEdit.dui || '',
        fechaNacimiento: userToEdit.fechaNacimiento || '',
        estado: userToEdit.estado || 'ACTIVO',
      });

      // Si vienen roles en la respuesta, los preseleccionamos
      const pre = Array.isArray((userToEdit as any).roles)
        ? (userToEdit as any).roles.map((r: any) => Number(r.id)).filter(Boolean)
        : [];
      setRolesSelected(pre);
    } else {
      reset({
        nombreCompleto: '',
        email: '',
        password: '',
        telefono: '',
        direccion: '',
        dui: '',
        fechaNacimiento: '',
        estado: 'ACTIVO',
      });
    }

    loadRoles();
  }, [visible, userToEdit, reset]);

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await rolesService.listarTodosSinPaginacion();
      setRoles(data || []);
    } catch (e) {
      console.warn('Error cargando roles', e);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const toggleRole = (id: number) => {
    setRolesSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goNext = () => setStep(2);
  const goBack = () => setStep(1);

  const isEditing = !!userToEdit;

  const submitAll = async (data: FormStep1) => {
    try {
      setLoading(true);

      if (isEditing && userToEdit) {
        // Actualizar
        const updatePayload: UpdateUsuarioRequest = {
          nombreCompleto: data.nombreCompleto.trim(),
          email: data.email.trim(),
          telefono: data.telefono.trim(),
          direccion: data.direccion.trim(),
          dui: data.dui.trim(),
          fechaNacimiento: data.fechaNacimiento.trim(),
          estado: data.estado,
          ...(data.password?.trim()
            ? { password: data.password.trim() }
            : {}),
        };

        await usuarioService.actualizar(userToEdit.id, updatePayload);

        // Asignar roles seleccionados (simple: sólo asigna; para sincronizar perfecto habría que remover los no seleccionados)
        if (askAssignRole && rolesSelected.length > 0) {
          // intenta asignar cada uno (el backend debería ignorar duplicados)
          for (const rid of rolesSelected) {
            try {
              await usuarioService.asignarRol(userToEdit.id, rid);
            } catch (err) {
              // ignoramos errores individuales de rol para no bloquear
              console.warn('Error asignando rol', rid, err);
            }
          }
        }

        Alert.alert('Éxito', 'Usuario actualizado correctamente');
      } else {
        // Crear
        const payload: CreateUsuarioRequest = {
          nombreCompleto: data.nombreCompleto.trim(),
          email: data.email.trim(),
          password: data.password.trim(),
          telefono: data.telefono.trim(),
          direccion: data.direccion.trim(),
          dui: data.dui.trim(),
          fechaNacimiento: data.fechaNacimiento.trim(),
          estado: data.estado,
          rolesIds: askAssignRole ? rolesSelected : [],
        };

        await usuarioService.crear(payload);
        console.log('➡️ Payload enviado:', JSON.stringify(payload, null, 2));

        Alert.alert('Éxito', 'Usuario creado correctamente');
      }

      reset();
      onClose();
      onCreated?.();
    } catch (err: any) {
      console.error(isEditing ? 'Error actualizando usuario:' : 'Error creando usuario:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (isEditing ? 'No se pudo actualizar el usuario' : 'No se pudo crear el usuario');
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const headerTitle = useMemo(
    () =>
      step === 1
        ? isEditing
          ? 'Editar Usuario'
          : 'Nuevo Usuario'
        : 'Asignación de Rol (opcional)',
    [step, isEditing]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{headerTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {step === 1 ? (
            <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ paddingBottom: 16 }}>
              <Field label="Nombre completo *" error={errors.nombreCompleto?.message}>
                <Controller
                  control={control}
                  name="nombreCompleto"
                  rules={{ required: 'Requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.nombreCompleto && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Nombre y apellido"
                    />
                  )}
                />
              </Field>

              <Field label="Email *" error={errors.email?.message}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'Requerido',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="correo@dominio.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  )}
                />
              </Field>

              <Field label={isEditing ? 'Contraseña (opcional)' : 'Contraseña *'} error={errors.password?.message}>
                <Controller
                  control={control}
                  name="password"
                  rules={
                    isEditing
                      ? undefined
                      : { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }
                  }
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="********"
                      secureTextEntry
                    />
                  )}
                />
              </Field>

              <Field label="Teléfono *" error={errors.telefono?.message}>
                <Controller
                  control={control}
                  name="telefono"
                  rules={{ required: 'Requerido' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.telefono && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="0000-0000"
                      keyboardType="phone-pad"
                    />
                  )}
                />
              </Field>

              <Field label="Dirección *" error={errors.direccion?.message}>
                <Controller
                  control={control}
                  name="direccion"
                  rules={{ required: 'Requerido' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.direccion && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Dirección"
                    />
                  )}
                />
              </Field>

              <Field label="DUI *" error={errors.dui?.message}>
                <Controller
                  control={control}
                  name="dui"
                  rules={{ required: 'Requerido' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.dui && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="00000000-0"
                    />
                  )}
                />
              </Field>

              <Field label="Fecha de nacimiento * (YYYY-MM-DD)" error={errors.fechaNacimiento?.message}>
                <Controller
                  control={control}
                  name="fechaNacimiento"
                  rules={{
                    required: 'Requerido',
                    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato YYYY-MM-DD' },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.fechaNacimiento && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="2000-01-31"
                    />
                  )}
                />
              </Field>

              <Field label="Estado *">
                <Controller
                  control={control}
                  name="estado"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.row}>
                      {(['ACTIVO', 'INACTIVO', 'SUSPENDIDO'] as UsuarioEstado[]).map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.chip, value === opt && styles.chipActive]}
                          onPress={() => onChange(opt)}
                        >
                          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </Field>
            </ScrollView>
          ) : (
            <View style={{ paddingBottom: 16 }}>
              <View style={styles.assignHeader}>
                <Text style={styles.label}>¿Asignar rol ahora?</Text>
                <Switch value={askAssignRole} onValueChange={setAskAssignRole} />
              </View>

              {askAssignRole && (
                <View style={{ maxHeight: 420 }}>
                  {loadingRoles ? (
                    <View style={styles.loadingWrap}>
                      <ActivityIndicator color="#2196F3" />
                      <Text style={{ marginLeft: 8 }}>Cargando roles...</Text>
                    </View>
                  ) : (
                    <ScrollView>
                      {roles.map((r) => {
                        const checked = rolesSelected.includes(Number(r.id));
                        return (
                          <TouchableOpacity
                            key={String(r.id)}
                            style={styles.roleItem}
                            onPress={() => toggleRole(Number(r.id))}
                          >
                            <View style={styles.roleIcon}>
                              <Ionicons name="extension-puzzle-outline" size={18} color="#FF9800" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.roleName}>{r.nombre}</Text>
                              <Text style={styles.roleId}>ID: {r.id}</Text>
                            </View>
                            <Ionicons
                              name={checked ? 'checkbox' : 'square-outline'}
                              size={22}
                              color={checked ? '#4CAF50' : '#999'}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          )}

          <View style={styles.footer}>
            {step === 2 ? (
              <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={goBack} disabled={loading}>
                <Text style={styles.secondaryText}>Atrás</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onClose} disabled={loading}>
                <Text style={styles.secondaryText}>Cancelar</Text>
              </TouchableOpacity>
            )}

            {step === 1 ? (
              <TouchableOpacity
                style={[styles.btn, styles.primary]}
                onPress={handleSubmit(() => goNext())}
                disabled={loading}
              >
                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryText}>Siguiente</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.btn, styles.primary]}
                onPress={handleSubmit(submitAll)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.primaryText}>{isEditing ? 'Guardar cambios' : 'Crear usuario'}</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {!!error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 16, maxHeight: 680 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#333' },
  closeBtn: { padding: 6 },

  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  inputError: { borderColor: '#F44336' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  error: { color: '#F44336', fontSize: 12, marginTop: 4 },

  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#ccc' },
  chipActive: { backgroundColor: '#E3F2FD', borderColor: '#2196F3' },
  chipText: { color: '#555', fontWeight: '600' },
  chipTextActive: { color: '#2196F3' },

  assignHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  loadingWrap: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  roleItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee'
  },
  roleIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  roleName: { fontSize: 15, fontWeight: '700', color: '#333' },
  roleId: { fontSize: 12, color: '#888', marginTop: 2 },

  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14 },
  secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  secondaryText: { color: '#333', fontWeight: '700' },
  primary: { backgroundColor: '#2196F3' },
  primaryText: { color: '#fff', fontWeight: '700' },
});
