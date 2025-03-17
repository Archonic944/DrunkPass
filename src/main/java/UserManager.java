import java.util.HashMap;
import java.util.UUID;

public class UserManager {
    static HashMap<String, String> dataMap = new HashMap<>();

    public static String getData(String secretKey){
        return dataMap.getOrDefault(secretKey, null);
    }

    public static boolean saveData(String secretKey, String pwdData){
        if(dataMap.containsKey(secretKey)){
            dataMap.put(secretKey, pwdData);
            return true;
        }else{
            return false;
        }
    }

    public static String newUser(){
        UUID key = UUID.randomUUID();
        String str = key.toString().replaceAll("", "");
        str = str.substring(0, 6); //nice and short :)
        dataMap.put(str, "hackclub\npassword123");
        return str;
    }
}
