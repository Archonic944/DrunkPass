import io.javalin.Javalin;
import io.javalin.http.HttpStatus;

public class MainServer {

    public static void main(String[] args) {
        Javalin j = Javalin.create(javalinConfig -> {
            javalinConfig.staticFiles.add("/public");
            javalinConfig.spaRoot.addFile("/", "public/index.html");
        });
        j.post("/newuser", ctx -> {
            ctx.status(HttpStatus.OK);
            String secretKey = UserManager.newUser();
            ctx.result(secretKey);
        });
        j.post("/login", ctx -> {
            ctx.status(HttpStatus.OK);
            String secretKey = ctx.body();
            System.out.println(secretKey);
            for(String key : UserManager.dataMap.keySet()){
                System.out.println(key);
            }
            String response = UserManager.getData(secretKey);
            if (response != null) {
                ctx.result(response);
            } else {
                ctx.status(HttpStatus.NOT_FOUND);
            }
        });
        j.post("/save", ctx -> {
            try {
                String response = ctx.body();
                String[] both = response.split(";");
                System.out.println(both.length);
                if(both.length != 2){
                    ctx.status(HttpStatus.BAD_REQUEST);
                    return;
                }
                System.out.println(both[0]);
                System.out.println(both[1]);
                boolean worked = UserManager.saveData(both[0], both[1]);
                if (worked) {
                    ctx.status(HttpStatus.OK);
                } else {
                    ctx.status(HttpStatus.BAD_REQUEST);
                }
            }catch(Exception ex){
                ctx.status(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
        j.start("0.0.0.0",80);
    }
}
